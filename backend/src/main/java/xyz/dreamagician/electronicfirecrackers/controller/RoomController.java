package xyz.dreamagician.electronicfirecrackers.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.dreamagician.electronicfirecrackers.game.Room;
import xyz.dreamagician.electronicfirecrackers.model.PlayerDto;
import xyz.dreamagician.electronicfirecrackers.model.request.RoomJoinHttpRequestBody;
import xyz.dreamagician.electronicfirecrackers.model.request.RoomSortPlayersHttpRequestBody;
import xyz.dreamagician.electronicfirecrackers.model.response.HttpResponseBody;
import xyz.dreamagician.electronicfirecrackers.model.request.RoomRemovePlayerHttpRequestBody;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api/room")
public class RoomController {
    private final Room room;

    @Autowired
    public RoomController(Room room) {
        this.room = room;
    }

    @PostMapping("join")
    public HttpResponseBody<String> join(@RequestBody RoomJoinHttpRequestBody body) {
        return HttpResponseBody.ok(room.newPlayerIfNotExist(body.getPlayerId()).getId());
    }

    @PostMapping("getPlayers")
    public HttpResponseBody<List<PlayerDto>> getPlayers() {
        return HttpResponseBody.ok(room.getPlayers());
    }

    @PostMapping("removePlayer")
    public HttpResponseBody<Void> removePlayer(@RequestBody RoomRemovePlayerHttpRequestBody body) throws IOException {
        room.removePlayer(body.getPlayerId());
        return HttpResponseBody.ok();
    }

    @PostMapping("sortPlayers")
    public HttpResponseBody<Void> sortPlayers(@RequestBody RoomSortPlayersHttpRequestBody body) {
        room.sortPlayers(body.getPlayerIds());
        return HttpResponseBody.ok();
    }

    @PostMapping("igniteStrands")
    public HttpResponseBody<Void> igniteStrands() {
        room.igniteStrands();
        return HttpResponseBody.ok();
    }

    @PostMapping("resetStrands")
    public HttpResponseBody<Void> resetStrands() {
        room.resetStrands();
        return HttpResponseBody.ok();
    }

    @PostMapping("resetPlayerNumbers")
    public HttpResponseBody<Void> resetPlayerNumbers() {
        room.resetPlayerNumbers();
        return HttpResponseBody.ok();
    }
}
