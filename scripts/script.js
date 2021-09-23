// var audioObj= new Audio;
var app = new Vue ({
    el:"#root",
    data:{
        userResponding:{},
        mediaRecorder:{},
        screenMessages:[{}],
        filteredContacts: [{}],
        selectedIndex:0,
        recording: false,
        contacts: [
            {
                name: 'Michele',
                avatar: '_1',
                visible: true,
                // audioObj: new Audio,
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
    methods:{
        changeIndex(index){
            this.selectedIndex=index;
        },
        selectUser(index){
            this.userResponding=this.filteredContacts[index];
            this.screenMessages=this.userResponding.messages;
        },
        sendMessage(){
            let currentMessage = document.getElementById("messageInput").value;
            if(currentMessage!=""){
                this.screenMessages.push({
                    date: this.getCurrentTime(),
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
                        date: this.getCurrentTime(),
                        message: temp,
                        status: 'received'
                    });
                }, 2000);
                document.getElementById("messageInput").value="";
            }
        },
        getCurrentTime(){
            var today = new Date();
            return (today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear() +"  "+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds());
        },
        filterUser(){
            let userToFilter = document.getElementById("filterInput").value.toLowerCase();
            this.filteredContacts=this.contacts.filter(element=>element.name.toLowerCase().includes(userToFilter));
            console.log(this.filteredContacts);
            console.log(userToFilter);
        },
        showHiddenMenu(index){
            if(document.getElementsByClassName("hiddenFunctions")[index].style.display == "none"){
                document.getElementsByClassName("hiddenFunctions")[index].style.display = "block";
            }else{
                document.getElementsByClassName("hiddenFunctions")[index].style.display = "none";
            }
        },
        hideFunctions(index){
            document.getElementsByClassName("hiddenFunctions")[index].style.display = "none";
        },
        deleteMessage(index){
            this.screenMessages.splice(index,1);
        },
        recordAudio(){
            if(this.recording==false){
                this.recording=true;
                let temp = {
                    date: this.getCurrentTime(),
                    status: 'sent',
                    type: 'audio'
                };
                navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
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
                        });
                        setTimeout(() => {
                            this.mediaRecorder.stop();
                            this.recording=false;
                        }, 10000);
                    });
            }else{
                this.mediaRecorder.stop();
            }
        },
        audioPlay(index){
            this.screenMessages[index].message.play();
        }
    },
    created (){
        this.filteredContacts=this.contacts.filter(element=>element.name.includes(""));
        this.selectUser(0);
    },
    updated(){
        document.getElementsByClassName("messageContainer")[0].scrollTop = document.getElementsByClassName("messageContainer")[0].scrollHeight;
    }
});