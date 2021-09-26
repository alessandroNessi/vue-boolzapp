var app = new Vue ({
    el:"#root",

    //*******************DATA
    data:{
        //if false the message are shown in the messagebox, if true show the videocontainer form
        hideMessages: false,

        //is the user wich we selected
        userResponding:{},

        //global mediarecorder object for audio and video recording
        mediaRecorder:{},

        //global stream object for video recrding
        stream: {},

        //messages shown on screen right now
        screenMessages:[{}],

        //contacts we selected during dinamic filtering
        filteredContacts: [{}],

        //the contact's index, set as 0 at first so we autoselect the first contact on open
        selectedIndex:0,

        //used to don't call the .stop() ok audio if mediaRecorder is listening a video event 
        recording: false,

        //false=video true=pic, used to toggle the videocamera or photocamera icon with both different methods
        videoOrPic: true,
        
        //global timeout on record so we can stop it when called in a different method (30s on both audio and video)
        recordingTimeOut:{},

        //used to toggle input menu with paperclip
        showInputOptions:false,
        contacts: [
            {
                name: 'Michele',
                avatar: '_1',
                visible: true,
                messages: [
                    {
                        date: '10/01/2020 15:30:55',
                        message: 'Hai portato a spasso il cane?',
                        status: 'sent',
                        type: 'text'
                    },
                    {
                        date: '10/01/2020 15:50:00',
                        message: 'Ricordati di dargli da mangiare',
                        status: 'sent',
                        type: 'text'
                    },
                    {
                        date: '10/01/2020 16:15:22',
                        message: 'Tutto fatto!',
                        status: 'received',
                        type: 'text'
                    }
                ],
            },
            {
                name: 'Fabio',
                avatar: '_2',
                visible: true,
                messages: [{
                    date: '20/03/2020 16:30:00',
                    message: 'Ciao come stai?',
                    status: 'sent',
                    type: 'text'
                },
                    {
                        date: '20/03/2020 16:30:55',
                        message: 'Bene grazie! Stasera ci vediamo?',
                        status: 'received',
                        type: 'text'
                    },
                    {
                        date: '20/03/2020 16:35:00',
                        message: 'Mi piacerebbe ma devo andare a fare la spesa.',
                        status: 'received',
                        type: 'text'
                    }
                ],
            },
            {
                name: 'Samuele',
                avatar: '_3',
                visible: true,
                messages: [{
                    date: '28/03/2020 10:10:40',
                    message: 'La Marianna va in campagna',
                    status: 'received',
                    type: 'text'
                },
                    {
                        date: '28/03/2020 10:20:10',
                        message: 'Sicuro di non aver sbagliato chat?',
                        status: 'sent',
                        type: 'text'
                    },
                    {
                        date: '28/03/2020 16:15:22',
                        message: 'Ah scusa!',
                        status: 'received',
                        type: 'text'
                    }
                ],
            },
            {
                name: 'Luisa',
                avatar: '_4',
                visible: true,
                messages: [{
                    date: '10/01/2020 15:30:55',
                    message: 'Lo sai che ha aperto una nuova pizzeria?',
                    status: 'sent',
                    type: 'text'
                },
                    {
                        date: '10/01/2020 15:50:00',
                        message: 'Si, ma preferirei andare al cinema',
                        status: 'received',
                        type: 'text'
                    }
                ],
            },
        ]
    },

    //*******************METHODS
    methods:{
        
        /**change index on contact clinck in the left screen */
        changeIndex(index){
            this.selectedIndex=index;
        },

        /**select the user to print messages on right screen */
        selectUser(index){
            this.userResponding=this.filteredContacts[index];
            this.screenMessages=this.userResponding.messages;
        },

        /**send the message to user on enter in the input bottom form */
        sendMessage(){
            let currentMessage = document.getElementById("messageInput").value;
            if(currentMessage!=""){
                this.screenMessages.push({
                    date: dayjs().format(`DD/MM/YYYY HH:MM:ss`),
                    message: currentMessage,
                    status: 'sent',
                    type: 'text'
                });

                /**different answers */
                let temp="scusa non ho capito";
                if(currentMessage.includes("come stai")||currentMessage.includes("come va")){
                    temp="ciao, sto bene, tu?";
                }else if(currentMessage.includes("ciao")||currentMessage.includes("hello")){
                    temp="ciao";
                }else if(currentMessage.includes("meteo")||currentMessage.includes("tempo")||currentMessage.includes("sole")||currentMessage.includes("nuvoloso")||currentMessage.includes("piove")){
                    temp="beh, quì c'è il sole";
                }else if(currentMessage.includes("a bird")||currentMessage.includes("la parola")||currentMessage.includes("the word")||currentMessage.includes("un uccello")){
                    temp="well everybody knows that the bird is the word!";
                }

                /**answer timeout */
                setTimeout(()=>{
                    this.screenMessages.push({
                        date: dayjs().format(`DD/MM/YYYY HH:MM:ss`),
                        message: temp,
                        status: 'received',
                        type: 'text'
                    });
                }, 2000);
                document.getElementById("messageInput").value="";
                this.switchTopContact();
            }
        },

        /**filter user based on the top left input search form */
        filterUser(){
            let userToFilter = document.getElementById("filterInput").value.toLowerCase();
            this.filteredContacts=this.contacts.filter(element=>element.name.toLowerCase().includes(userToFilter));
            console.log(this.filteredContacts);
            console.log(userToFilter);
        },

        /**show the hidden menu in messages to get info or delete 'em */
        showHiddenMenu(index){
            if(document.getElementsByClassName("hiddenFunctions")[index].style.display == "none"){
                document.getElementsByClassName("hiddenFunctions")[index].style.display = "block";
            }else{
                document.getElementsByClassName("hiddenFunctions")[index].style.display = "none";
            }
        },

        /**hide the hidden message menu */
        hideFunctions(index){
            document.getElementsByClassName("hiddenFunctions")[index].style.display = "none";
        },

        /**thelete the 'index' message */
        deleteMessage(index){
            this.screenMessages.splice(index,1);
        },

        /**record an audio and put it in the user's messages, has 30s timeout can be stopped by clicking again on it */
        recordAudio(){
            if(this.recording==false){
                this.recording='waiting answer';
                let temp = {
                    date: dayjs().format(`DD/MM/YYYY HH:MM:ss`),
                    status: 'sent',
                    type: 'audio'
                };
                //set media device on audio and get data stream
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(stream => {
                        this.recording='audio';
                        //set a recording obj with audio data stream passed
                        this.mediaRecorder = new MediaRecorder(stream);
                        //start recording
                        this.mediaRecorder.start();
                        const audioChunks = [];
                        //for each chunk of data we push it in our Datachunks
                        this.mediaRecorder.addEventListener("dataavailable", event => {
                            audioChunks.push(event.data);
                        });
                        //when we stop the audio i add an event wich:
                        this.mediaRecorder.addEventListener("stop", () => {
                            //1) create a blob on chunks
                            const audioBlob = new Blob(audioChunks);
                            //2) create an url that points at blob
                            const audioUrl = URL.createObjectURL(audioBlob);
                            //3) push the audiourl as message in the messages obj associated with the current user
                            temp.message= new Audio(audioUrl);
                            this.screenMessages.push(temp);
                            //4) the user we sent the message is now the top user in the list
                            this.switchTopContact();
                            //5)clear the timeout
                            clearTimeout(this.recordingTimeOut);
                            //save in the global recording i'm not recording anymmore
                            this.recording=false;
                        });

                        //30s timeout
                        this.recordingTimeOut = setTimeout(() => {
                            this.mediaRecorder.stop();
                            this.recording=false;
                        }, 30000);
                    })
                    .catch((err)=>{
                        this.recording=false;
                        console.log("An error occurred: " + err);
                    });
            }
        },

/**START VIDEO */
        startVideo(){
            //if not recording
            if(this.recording==false){
                let video = document.getElementById('video');
                //i select mediadevice camera and mic
                navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                    .then(stream => {
                        //i show the videomonitor
                        document.getElementById("videoContainer").style.display="flex";
                        //and hide messages
                        this.hideMessages=true;
                        //tells globally i am on video event
                        this.recording='video';
                        //assign the data stream to a global data
                        this.stream=stream;
                        //assign the global mediaRecorde the stream on data
                        this.mediaRecorder = new MediaRecorder(this.stream);
                        //assign the stream of data to the video preview with button video below
                        video.srcObject = this.stream;
                        //and play the datastream
                        video.play();
                    })
                    .catch(function (err) {//cattura il rifiuto alla camera
                        this.hideMessages=false;
                        this.recording=false;
                        console.log("An error occurred: " + err);
                });
            }
        },

/**RECORD VIDEO */
        recordVideo(){
            let temp = {
                date: dayjs().format(`DD/MM/YYYY HH:MM:ss`),
                status: 'sent',
                type: 'video'
            };
            let mediaChunks = [];
            //push the chunks from the stream in it's array
            this.mediaRecorder.ondataavailable = function(event) {
                mediaChunks.push(event.data);
            }
            //i tell globally that i'm recording (used to cahnge icon from camera do square)
            this.recording='videoStarted';
            //start recprdomg both audio and video
            this.mediaRecorder.start();
            //on stop recording:
            this.mediaRecorder.addEventListener("stop", () => {
                //i created an url from blob->made of chunks as for audio
                let video_local = URL.createObjectURL(new Blob(mediaChunks, { type: "video/webm" }));
                //stop the stream
                this.stream.getTracks().forEach(function (track) {
                    track.stop();
                });
                //hide the video
                document.getElementById("videoContainer").style.display="none";
                //show messages
                this.hideMessages=false;
                //tells globally i'm no longer recording
                this.recording=false;
                //clear the dimeout of 30s
                clearTimeout(this.recordingTimeOut);
                // clear the stream
                this.stream="";
                //set the video as message and put it in the user's messages
                temp.message = video_local;
                this.screenMessages.push(temp);
                //put user on top
                this.switchTopContact();
            });
            //30s timeout
            this.recordingTimeOut = setTimeout(() => {
                this.mediaRecorder.stop();
            }, 3000);
        },

/**TAKES PIC*/
        takePic(){
            let video = document.getElementById('video');
            let canvas = document.getElementById('canvas');
            let temp = {
                date: dayjs().format(`DD/MM/YYYY HH:MM:ss`),
                status: 'sent',
                type: 'pic'
            };
            //devine 2d context for canvas
            var context = canvas.getContext('2d');
            //draw image currently shown on video
            context.drawImage(video, 0, 0, 1024, 768);
            //assign the image to the message and push it
            temp.message=canvas.toDataURL('image/png');
            this.screenMessages.push(temp);
            //hide videocontainer
            document.getElementById("videoContainer").style.display="none";
            //show messages
            this.hideMessages=false;
            //tell globally i'm no logner recording
            this.recording=false;
            //stop the stream
            this.stream.getTracks().forEach(function (track) {
                track.stop();
            });
            this.stream="";
            //swithch contact on top
            this.switchTopContact();
        },

        /**show the pic and ask if you wanna keep */
        /**still to do */

        /**start the play of the audio item in the selected index */
        audioPlay(index){
            this.screenMessages[index].message.play();
        },

        /**check if the message before is same status as this */
        sameStatusPrevMsg(index){
            if(index==0){
                return false;
            }else if(this.screenMessages[index].status!=this.screenMessages[index-1].status){
                return false;
            }
            return true;
        },

        /**switch contacs on top based on the last message sent*/
        switchTopContact(){
            if(this.userResponding.name!=this.contacts[0].name){
                let temp=this.contacts[0], index=0, found=false;
                while( index<this.contacts.length-1 && found==false){
                    index++;
                    (this.contacts[index].name==this.userResponding.name)? found=true : "";
                }
                this.contacts[0]=this.userResponding;
                this.contacts[index]=temp;
                this.filterUser();
                this.changeIndex(0);
            }
        }
    },

    //*******************VUESTATUS
    created (){
        this.filteredContacts=this.contacts.filter(element=>element.name.includes(""));
        this.selectUser(0);
    },
    updated(){
        //scroll to the bottom message just after the uptdate page
        document.getElementsByClassName("messageContainer")[0].scrollTop = document.getElementsByClassName("messageContainer")[0].scrollHeight;
    }
});