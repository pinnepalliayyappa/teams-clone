import { Component } from '@angular/core';
import AgoraRTC, {IAgoraRTCClient, ILocalAudioTrack, ILocalVideoTrack } from "agora-rtc-sdk-ng";

@Component({
  selector: 'app-video-sharing',
  templateUrl: './video-sharing.component.html',
  styleUrls: ['./video-sharing.component.css']
})
export class VideoSharingComponent {

rtc = {
    localAudioTrack: undefined as ILocalAudioTrack | undefined,
    localVideoTrack: undefined as ILocalVideoTrack | undefined,
    client:  AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }) as IAgoraRTCClient,
};
micIcon: boolean = false;
muteIcon: boolean = true;
micBtn: boolean = false; 
videoBtn: boolean = false; 
videoIcon: boolean = true; 
videooffIcon: boolean =false;

options = {
    // Pass your app ID here.
    appId: "cda5134050bf4f65b39a3f6de3b297f7",
    // Set the channel name.
    channel: "teams",
    // Use a temp token
    token: "007eJxTYHgvdva33f8jJen+m3VDCk3LjmlOdcz12zZ78x+5SPu3R6UUGJJTEk0NjU0MTA2S0kzSzEyTjC0TjdPMUlKNk4wszdPMH4qrpzcEMjL8vNLHxMgAgSA+K0NJamJuMQMDAMI8ISc=",
    // Set the user ID.
    uid: 123456,
};

async ngOnInit() {
    // Create an AgoraRTCClient object.
    this.rtc.client = AgoraRTC.createClient({mode: "rtc", codec: "vp8"});

    // Listen for the "user-published" event, from which you can get an AgoraRTCRemoteUser object.
    this.rtc.client.on("user-published", async (user, mediaType) => {
        // Subscribe to the remote user when the SDK triggers the "user-published" event
        await this.rtc.client.subscribe(user, mediaType);
        console.log("subscribe success");

        // If the remote user publishes a video track.
        if (mediaType === "video") {
            // Get the RemoteVideoTrack object in the AgoraRTCRemoteUser object.
            const remoteVideoTrack = user.videoTrack;
            // Dynamically create a container in the form of a DIV element for playing the remote video track.
            // const remotePlayerContainer = document.createElement("div");
            // // Specify the ID of the DIV container. You can use the uid of the remote user.
            // remotePlayerContainer.id = user.uid.toString();
            // remotePlayerContainer.textContent = "Remote user " + user.uid.toString();
            // remotePlayerContainer.style.width = "640px";
            // remotePlayerContainer.style.height = "480px";
            // document.body.append(remotePlayerContainer);
            const remotePlayerContainer = document.querySelector('.outgoing-video') as HTMLElement;
            remotePlayerContainer.id = user.uid.toString();
            remotePlayerContainer.textContent = "Remote user " + user.uid.toString();

            // Play the remote video track.
            // Pass a DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
            remoteVideoTrack?.play(remotePlayerContainer);
        }

        // If the remote user publishes an audio track.
        if (mediaType === "audio") {
            // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
            const remoteAudioTrack = user.audioTrack;
            // Play the remote audio track. No need to pass any DOM element.
            remoteAudioTrack?.play();
        }

        // Listen for the "user-unpublished" event
        this.rtc.client.on("user-unpublished", user => {
            // Get the dynamically created DIV container.
            const remotePlayerContainer = document.getElementById(String(user?.uid));
            // Destroy the container.
            remotePlayerContainer?.remove();
        });
    });
  }
  async joinmethod(){
      // Join an RTC channel.
      this.options.uid = Math.floor(Math.random() * 100);
      await this.rtc.client.join(this.options.appId, this.options.channel, this.options.token, this.options.uid);
      // Create a local audio track from the audio sampled by a microphone.
      this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      // Create a local video track from the video captured by a camera.
      this.rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      // Publish the local audio and video tracks to the RTC channel.
      await this.rtc.client.publish([this.rtc.localAudioTrack, this.rtc.localVideoTrack]);
      // Dynamically create a container in the form of a DIV element for playing the local video track.
      const localPlayerContainer = document.querySelector('.incoming-video') as HTMLElement;
      // Specify the ID of the DIV container. You can use the uid of the local user.
      if(localPlayerContainer){
        localPlayerContainer.id = String (this.options.uid);
        localPlayerContainer.textContent = "Local user " + this.options.uid;
        // localPlayerContainer. = "640px";
        // localPlayerContainer.style.height = "480px";
        // Play the local video track.
        // Pass the DIV container and the SDK dynamically creates a player in the container for playing the local video track.
        this.rtc.localVideoTrack.play( (localPlayerContainer));
      }

    
      console.log("publish success!");
  }
  async leavemethod(){
     // Destroy the local audio and video tracks.
     if (this.rtc.localAudioTrack) {
      this.rtc.localAudioTrack.close();
    }
    if (this.rtc.localVideoTrack) {
        this.rtc.localVideoTrack.close();
    }
  

     // Remove the container for the local video track.
     const localPlayerContainer = document.getElementById(String(this.options.uid));
     if (localPlayerContainer) {
         localPlayerContainer.remove();
     }

     // Traverse all remote users.
     this.rtc.client.remoteUsers.forEach(user => {
         // Destroy the dynamically created DIV containers.
         const playerContainer = document.getElementById(String(user.uid));
         playerContainer && playerContainer.remove();
     });

     // Leave the channel.
     await this.rtc.client.leave();
  }
  async mute() { 
    this.micIcon = !this.micIcon; 
    this.muteIcon = !this.muteIcon; 
    this.rtc.localAudioTrack?.setEnabled(!this.muteIcon); 
  } 
  async videoonoff() { 
   this.videoIcon = !this.videoIcon; 
   this.videooffIcon = !this.videooffIcon; 
   this.rtc?.localVideoTrack?.setEnabled(!this.videooffIcon); 
  }

}
