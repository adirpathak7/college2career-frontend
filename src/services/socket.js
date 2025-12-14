import { io } from "socket.io-client";
import Cookies from "js-cookie";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  auth: (cb) => {
    cb({ token: Cookies.get("userToken") });
  },
  autoConnect: true,
});

export default socket;
