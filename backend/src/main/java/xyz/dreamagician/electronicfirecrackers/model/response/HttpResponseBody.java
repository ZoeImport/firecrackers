package xyz.dreamagician.electronicfirecrackers.model.response;

public class HttpResponseBody<T> {
    public static HttpResponseBody<Void> ok() {
        return new HttpResponseBody<>(Code.OK.getValue(), new Message(MessageType.debug, "OK"), null);
    }

    public static <T> HttpResponseBody<T> ok(T data) {
        return new HttpResponseBody<>(Code.OK.getValue(), new Message(MessageType.debug, "OK"), data);
    }

    public int code;
    private Message message;
    public T data;

    public HttpResponseBody() {
    }

    public HttpResponseBody(int code, Message message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public Message getMessage() {
        return message;
    }

    public void setMessage(Message message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
