import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Cookies from "js-cookie";

const VideoMeet = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const socketRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const localStreamRef = useRef(null);
    const peerRef = useRef(null);

    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);
    const [screenSharing, setScreenSharing] = useState(false);

    const [isHost, setIsHost] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [joinRequest, setJoinRequest] = useState(false);
    const [guestEmail, setGuestEmail] = useState("");

    const [showDismissModal, setShowDismissModal] = useState(false);
    const [userLeftMsg, setUserLeftMsg] = useState("");
    const [hostLeftMsg, setHostLeftMsg] = useState("");

    const openMeetInNewWindow = (roomId) => {
        window.open(
            `/meet/${roomId}`,
            "_blank",
            "noopener,noreferrer"
        );
    };

    /* ---------------- VALIDATE MEETING ---------------- */
    useEffect(() => {
        const validate = async () => {
            const res = await fetch(
                `http://localhost:5000/api/meet/validate/${roomId}`
            );
            const data = await res.json();

            if (!data.valid) {
                alert("Invalid meeting link");
                navigate("/");
            }
        };
        validate();
    }, [roomId, navigate]);

    /* ---------------- SOCKET + WEBRTC INIT ---------------- */
    useEffect(() => {
        const socket = io("http://localhost:5000/meet", {
            transports: ["websocket"],
            forceNew: true,
            reconnection: false,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("MEET SOCKET CONNECTED:", socket.id);
        });

        socket.on("disconnect", (r) => {
            console.log("MEET SOCKET DISCONNECTED:", r);
        });

        const init = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            localStreamRef.current = stream;
            localVideoRef.current.srcObject = stream;

            peerRef.current = new RTCPeerConnection({
                iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
            });

            stream.getTracks().forEach((t) =>
                peerRef.current.addTrack(t, stream)
            );

            peerRef.current.ontrack = (e) => {
                remoteVideoRef.current.srcObject = e.streams[0];
            };

            peerRef.current.onicecandidate = (e) => {
                if (e.candidate) {
                    socket.emit("ice-candidate", {
                        roomId,
                        candidate: e.candidate,
                    });
                }
            };

            const token = Cookies.get("userToken");
            socket.emit("request-join", { roomId, token });
        };

        init();

        /* -------- SOCKET EVENTS -------- */
        socket.on("host-confirmed", () => setIsHost(true));
        socket.on("waiting", () => setWaiting(true));

        socket.on("join-request", ({ email }) => {
            setGuestEmail(email);
            setJoinRequest(true);
        });

        socket.on("admitted", () => {
            setWaiting(false);
            socket.emit("final-join", { roomId });
        });

        socket.on("dismissed", () => {
            setWaiting(false);
            setShowDismissModal(true);
        });

        socket.on("meeting-full", () => {
            alert("Meeting is full");
            navigate("/");
        });

        socket.on("user-joined", async () => {
            const offer = await peerRef.current.createOffer();
            await peerRef.current.setLocalDescription(offer);
            socket.emit("offer", { roomId, offer });
        });

        socket.on("offer", async (offer) => {
            await peerRef.current.setRemoteDescription(offer);
            const answer = await peerRef.current.createAnswer();
            await peerRef.current.setLocalDescription(answer);
            socket.emit("answer", { roomId, answer });
        });

        socket.on("answer", (answer) => {
            peerRef.current.setRemoteDescription(answer);
        });

        socket.on("ice-candidate", (c) => {
            peerRef.current.addIceCandidate(c);
        });

        socket.on("user-left", ({ email }) => {
            setUserLeftMsg(`${email || "User"} left the meeting`);
            setTimeout(() => setUserLeftMsg(""), 3000);
        });

        socket.on("host-left", () => {
            setHostLeftMsg("Host has left the meeting");
            setTimeout(() => navigate("/"), 2000);
        });

        return () => {
            socket.disconnect();
            peerRef.current?.close();
            localStreamRef.current?.getTracks().forEach((t) => t.stop());
        };
    }, [roomId, navigate]);

    /* ---------------- CONTROLS ---------------- */
    const toggleMic = () => {
        localStreamRef.current
            ?.getAudioTracks()
            .forEach((t) => (t.enabled = !micOn));
        setMicOn(!micOn);
    };

    const toggleCamera = () => {
        localStreamRef.current
            ?.getVideoTracks()
            .forEach((t) => (t.enabled = !cameraOn));
        setCameraOn(!cameraOn);
    };

    const toggleScreenShare = async () => {
        if (!screenSharing) {
            const s = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const track = s.getVideoTracks()[0];
            const sender = peerRef.current
                .getSenders()
                .find((x) => x.track.kind === "video");

            sender.replaceTrack(track);
            localVideoRef.current.srcObject = s;
            setScreenSharing(true);

            track.onended = () => toggleScreenShare();
        } else {
            const cam = localStreamRef.current.getVideoTracks()[0];
            const sender = peerRef.current
                .getSenders()
                .find((x) => x.track.kind === "video");

            sender.replaceTrack(cam);
            localVideoRef.current.srcObject = localStreamRef.current;
            setScreenSharing(false);
        }
    };

    /* ---------------- UI ---------------- */
    return (
        <div className="h-screen bg-zinc-900 text-white flex flex-col">
            <div className="h-14 px-4 flex items-center justify-between border-b border-zinc-800">
                <span className="font-semibold">SyncLynk Meet</span>
            </div>

            <div className="flex-1 relative">
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                />
                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="absolute bottom-6 right-6 w-56 h-36 rounded-lg border"
                />
            </div>

            {waiting && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    Waiting for host approval…
                </div>
            )}

            {joinRequest && isHost && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-zinc-900 p-6 rounded-xl w-80">
                        <h3 className="text-lg font-semibold mb-2">Join Request</h3>
                        <p className="mb-4 text-sm text-zinc-300">
                            {guestEmail} wants to join
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    socketRef.current.emit("dismiss-user", { roomId });
                                    setJoinRequest(false);     // ✅ POPUP CLOSE
                                    setGuestEmail("");
                                }}
                                className="px-4 py-2 bg-zinc-700 rounded"
                            >
                                Dismiss
                            </button>

                            <button
                                onClick={() => {
                                    socketRef.current.emit("admit-user", { roomId });
                                    setJoinRequest(false);     // ✅ POPUP CLOSE
                                    setGuestEmail("");
                                }}
                                className="px-4 py-2 bg-green-600 rounded"
                            >
                                Admit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="h-20 flex items-center justify-center gap-4 border-t border-zinc-800">
                <button
                    onClick={toggleMic}
                    className="px-4 py-2 rounded bg-zinc-700"
                >
                    {micOn ? "Mute" : "Unmute"}
                </button>

                <button
                    onClick={toggleCamera}
                    className="px-4 py-2 rounded bg-zinc-700"
                >
                    {cameraOn ? "Camera Off" : "Camera On"}
                </button>

                <button
                    onClick={toggleScreenShare}
                    className="px-4 py-2 rounded bg-blue-600"
                >
                    {screenSharing ? "Stop Share" : "Share Screen"}
                </button>

                <button
                    onClick={() => {
                        socketRef.current.disconnect();
                        navigate("/");
                    }}
                    className="px-5 py-2 rounded bg-red-600"
                >
                    Leave
                </button>
            </div>
        </div>
    );
};

export default VideoMeet;
