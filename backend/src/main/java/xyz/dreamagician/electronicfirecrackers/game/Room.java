package xyz.dreamagician.electronicfirecrackers.game;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;
import xyz.dreamagician.electronicfirecrackers.model.PlayerDto;
import xyz.dreamagician.electronicfirecrackers.model.PlayerGameData;
import xyz.dreamagician.electronicfirecrackers.model.StrandStatusDto;
import xyz.dreamagician.electronicfirecrackers.model.StrandType;
import xyz.dreamagician.electronicfirecrackers.model.socket.SocketServerSendPlayerGameDataPack;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.Executor;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

@Component
public class Room {
    private final Logger logger = LoggerFactory.getLogger(Room.class);

    private final static long SINGLE_STRAND_DURATION;
    private final static long FIRST_STRAND_DURATION;
    private final static long MIDDLE_STRAND_DURATION;
    private final static long LAST_STRAND_DURATION;

    static {
        double blastingFuseSpeed = 200.0 / 1000;
        double strandUnitLength = 25;
        int singleBlastingFuseLength = 32;
        int firstBlastingFuseLength = 36;
        int middleBlastingFuseLength = 54;
        int lastBlastingFuseLength = 50;
        SINGLE_STRAND_DURATION = Math.round(singleBlastingFuseLength * strandUnitLength / blastingFuseSpeed);
        FIRST_STRAND_DURATION = Math.round(firstBlastingFuseLength * strandUnitLength / blastingFuseSpeed);
        MIDDLE_STRAND_DURATION = Math.round(middleBlastingFuseLength * strandUnitLength / blastingFuseSpeed);
        LAST_STRAND_DURATION = Math.round(lastBlastingFuseLength * strandUnitLength / blastingFuseSpeed);
    }

    private final ObjectMapper objectMapper;
    private final Map<String, Player> playerMap;
    private final List<Player> playerList;
    private int nextPlayerNumber;
    private final StrandsStatus strandsStatus;
    private final Executor executor;
    private final Timer timer;
    private TimerTask timerTask;

    @Autowired
    public Room(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        playerMap = new HashMap<>();
        playerList = new ArrayList<>();
        nextPlayerNumber = 1;
        strandsStatus = new StrandsStatus();
        executor = new ThreadPoolExecutor(5, 5, 0, TimeUnit.MICROSECONDS, new LinkedBlockingQueue<>());
        timer = new Timer();
    }

    public synchronized List<PlayerDto> getPlayers() {
        List<PlayerDto> playerDtoList = new ArrayList<>();
        for (Player player : playerList) {
            PlayerDto playerDto = new PlayerDto();
            playerDto.setId(player.getId());
            playerDto.setNumber(player.getNumber());
            playerDto.setConnected(player.isConnected());
            playerDtoList.add(playerDto);
        }
        return playerDtoList;
    }

    public synchronized boolean hasPlayer(String playerId) {
        return playerMap.containsKey(playerId);
    }

    public synchronized Player newPlayer() {
        String playerId;
        do {
            playerId = UUID.randomUUID().toString();
        } while (playerMap.containsKey(playerId));
        Player player = new Player(playerId, nextPlayerNumber);
        nextPlayerNumber++;
        playerMap.put(playerId, player);
        playerList.add(player);
        doResetStrands();
        sendGameDataToPlayersAsync();
        return player;
    }

    public synchronized Player newPlayerIfNotExist(String playerId) {
        Player player = playerMap.get(playerId);
        if (player == null) {
            return newPlayer();
        } else {
            return player;
        }
    }

    public synchronized void removePlayer(String playerId) throws IOException {
        Player player = playerMap.get(playerId);
        if (player != null) {
            player.disconnect();
            playerMap.remove(playerId);
            playerList.remove(player);
            doResetStrands();
            sendGameDataToPlayersAsync();
        }
    }

    public synchronized void sortPlayers(List<String> playerIds) {
        int i = 0;
        for (String playerId : playerIds) {
            Player player = playerMap.get(playerId);
            if (player != null) {
                playerList.set(playerList.indexOf(player), playerList.get(i));
                playerList.set(i, player);
                i++;
            }
        }
        doResetStrands();
        sendGameDataToPlayersAsync();
    }

    public synchronized boolean connect(String playerId, WebSocketSession session) throws IOException {
        Player player = playerMap.get(playerId);
        if (player == null) {
            return false;
        } else {
            player.connect(session);
            sendGameDataToPlayerAsync(player);
            return true;
        }
    }

    public synchronized void disconnect(String playerId) throws IOException {
        Player player = playerMap.get(playerId);
        if (player != null) {
            player.disconnect();
            sendGameDataToPlayerAsync(player);
        }
    }

    public synchronized void igniteStrands() {
        if (!strandsStatus.isIgnited() && !playerList.isEmpty()) {
            strandsStatus.ignite();
            strandsNext();
        }
    }

    private synchronized void strandsNext() {
        if (strandsStatus.isIgnited() && !strandsStatus.isFinished()) {
            int index = strandsStatus.getCurrentIndex();
            int nextIndex = index + 1;
            if (nextIndex < playerList.size()) {
                Player player = null;
                if (index >= 0) {
                    player = playerList.get(index);
                    player.getStrandStatus().finish();
                }
                long duration;
                if (playerList.size() == 1) {
                    duration = SINGLE_STRAND_DURATION;
                } else if (nextIndex == 0) {
                    duration = FIRST_STRAND_DURATION;
                } else if (nextIndex == playerList.size() - 1) {
                    duration = LAST_STRAND_DURATION;
                } else {
                    duration = MIDDLE_STRAND_DURATION;
                }
                Player nextPlayer = playerList.get(nextIndex);
                nextPlayer.getStrandStatus().ignite(System.currentTimeMillis(), duration);
                strandsStatus.next();
                if (player != null) {
                    sendGameDataToPlayerAsync(player);
                }
                sendGameDataToPlayerAsync(nextPlayer);
                if (timerTask != null) {
                    timerTask.cancel();
                }
                timerTask = new TimerTask() {
                    @Override
                    public void run() {
                        strandsNext();
                    }
                };
                timer.schedule(timerTask, duration);
            } else {
                Player player = playerList.get(index);
                player.getStrandStatus().finish();
                strandsStatus.finish();
                sendGameDataToPlayerAsync(player);
            }
        }
    }

    private synchronized void doResetStrands() {
        strandsStatus.reset();
        for (Player player : playerList) {
            player.getStrandStatus().reset();
        }
        if (timerTask != null) {
            timerTask.cancel();
            timerTask = null;
        }
    }

    public synchronized void resetStrands() {
        doResetStrands();
        sendGameDataToPlayersAsync();
    }

    public synchronized void resetPlayerNumbers() {
        int i = 1;
        for (Player player : playerList) {
            player.setNumber(i);
            i++;
        }
        nextPlayerNumber = i;
        sendGameDataToPlayersAsync();
    }

    public synchronized void sendGameDataToPlayersAsync() {
        for (Player player : playerList) {
            PlayerGameData playerGameData = createPlayerGameData(player);
            executor.execute(() -> {
                try {
                    player.sendMessage(objectMapper.writeValueAsString(new SocketServerSendPlayerGameDataPack(playerGameData)));
                } catch (Throwable e) {
                    logger.error(e.getMessage(), e);
                }
            });
        }
    }

    public synchronized void sendGameDataToPlayerAsync(Player player) {
        PlayerGameData playerGameData = createPlayerGameData(player);
        executor.execute(() -> {
            try {
                player.sendMessage(objectMapper.writeValueAsString(new SocketServerSendPlayerGameDataPack(playerGameData)));
            } catch (Throwable e) {
                logger.error(e.getMessage(), e);
            }
        });
    }

    private synchronized PlayerGameData createPlayerGameData(Player player) {
        int index = playerList.indexOf(player);
        if (index == -1) {
            return null;
        }
        PlayerGameData playerGameData = new PlayerGameData();
        playerGameData.setTimeStamp(System.currentTimeMillis());
        PlayerDto playerDto = new PlayerDto();
        playerDto.setId(player.getId());
        playerDto.setNumber(player.getNumber());
        playerDto.setConnected(true);
        playerGameData.setPlayer(playerDto);
        if (playerList.size() == 1) {
            playerGameData.setStrandType(StrandType.single);
        } else if (index == 0) {
            playerGameData.setStrandType(StrandType.first);
        } else if (index == playerList.size() - 1) {
            playerGameData.setStrandType(StrandType.last);
        } else {
            playerGameData.setStrandType(StrandType.middle);
        }
        StrandStatus strandStatus = player.getStrandStatus();
        StrandStatusDto strandStatusDto = new StrandStatusDto();
        strandStatusDto.setIgnited(strandStatus.isIgnited());
        strandStatusDto.setFinished(strandStatus.isFinished());
        strandStatusDto.setIgniteTime(strandStatus.getIgniteTime());
        strandStatusDto.setDuration(strandStatus.getDuration());
        playerGameData.setStrandStatus(strandStatusDto);
        return playerGameData;
    }
}
