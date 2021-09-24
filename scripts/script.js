var app = new Vue ({
    el:"#root",

    //*******************DATA
    data:{
        hideMessages: false,
        userResponding:{},
        mediaRecorder:{},
        screenMessages:[{}],
        filteredContacts: [{}],
        selectedIndex:0,
        recording: false,//used to don't call the .stop() ok audio if mediaRecorder is listening a video event 
        recordingTimeOut:{},
        showInputOptions:false,//used to toggle input menu with paperclip
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
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(stream => {
                        this.recording='audio';
                        this.mediaRecorder = new MediaRecorder(stream);
                        this.mediaRecorder.start();
                        const audioChunks = [];
                        this.mediaRecorder.addEventListener("dataavailable", event => {
                            audioChunks.push(event.data);
                        });
                        this.mediaRecorder.addEventListener("stop", () => {
                            const audioBlob = new Blob(audioChunks);
                            const audioUrl = URL.createObjectURL(audioBlob);
                            temp.message= new Audio(audioUrl);
                            this.screenMessages.push(temp);
                            this.switchTopContact();
                        });
                        this.recordingTimeOut = setTimeout(() => {
                            this.mediaRecorder.stop();
                            this.recording=false;
                        }, 30000);
                    })
                    .catch((err)=>{
                        this.recording=false;
                        console.log("An error occurred: " + err);
                    });
            }else if(this.recording=='audio'){
                this.mediaRecorder.stop();
                clearTimeout(this.recordingTimeOut);
                this.recording=false;
                this.switchTopContact();
            }
        },

        /**function that start video */
        startVideo(){
            let video = document.getElementById('video');
            if(this.recording==false){
                document.getElementById("videoContainer").style.display="flex";
                this.hideMessages=true;
                this.recording='video';
                navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                    .then(stream => {
                        this.mediaRecorder = stream;
                        video.srcObject = this.mediaRecorder;
                        video.play();
                    })
                    .catch(function (err) {//cattura il rifiuto alla camera
                        this.hideMessages=false;
                        this.recording=false;
                        console.log("An error occurred: " + err);
                });
            }
        },

        /**function that take a pic */
        takePic(){
            let video = document.getElementById('video');
            let canvas = document.getElementById('canvas');
            canvas.setAttribute('width', 800);
            canvas.setAttribute('height', 600);
            let photo = document.getElementById('photo');
            let temp = {
                date: dayjs().format(`DD/MM/YYYY HH:MM:ss`),
                status: 'sent',
                type: 'pic'
            };
            var context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, 800, 600);
            temp.message=canvas.toDataURL('image/png');
            this.screenMessages.push(temp);
            document.getElementById("videoContainer").style.display="none";
            this.hideMessages=false;
            this.recording=false;
            this.mediaRecorder.getTracks().forEach(function (track) {
                track.stop();
            });
            this.mediaRecorder="";
            this.switchTopContact();
            var data = canvas.toDataURL('image/png');
            photo.setAttribute('src', data);
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