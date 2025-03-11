import Pusher from "pusher-js";

const pusher = new Pusher("a8b7b2f88f82155450ac", {
  cluster: "eu",
});

const channel = pusher.subscribe("chat");
export const channelAction = (cb: (message: string) => void, action: string) =>
  channel.bind(
    action,
    (data: { message: string; send: number; receive: number }) => {
      data.receive = Date.now();

      cb(data.message);
    }
  );
