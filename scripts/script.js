var app = new Vue ({
    el:"#root",
    data:{
        userResponding:{},
        screenMessages:[{}],
        filteredContacts: [{}],
        selectedIndex:0,
        contacts: [
            {
                name: 'Michele',
                avatar: '_1',
                visible: true,
                messages: [
                    {
                        date: '10/01/2020 15:30:55',
                        message: 'Hai portato a spasso il cane?',
                        status: 'sent'
                    },
                    {
                        date: '10/01/2020 15:50:00',
                        message: 'Ricordati di dargli da mangiare',
                        status: 'sent'
                    },
                    {
                        date: '10/01/2020 16:15:22',
                        message: 'Tutto fatto!',
                        status: 'received'
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
                    status: 'sent'
                },
                    {
                        date: '20/03/2020 16:30:55',
                        message: 'Bene grazie! Stasera ci vediamo?',
                        status: 'received'
                    },
                    {
                        date: '20/03/2020 16:35:00',
                        message: 'Mi piacerebbe ma devo andare a fare la spesa.',
                        status: 'received'
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
                    status: 'received'
                },
                    {
                        date: '28/03/2020 10:20:10',
                        message: 'Sicuro di non aver sbagliato chat?',
                        status: 'sent'
                    },
                    {
                        date: '28/03/2020 16:15:22',
                        message: 'Ah scusa!',
                        status: 'received'
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
                    status: 'sent'
                },
                    {
                        date: '10/01/2020 15:50:00',
                        message: 'Si, ma preferirei andare al cinema',
                        status: 'received'
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
                    status: 'sent'
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
        }
    },
    mounted (){
        this.filteredContacts=this.contacts.filter(element=>element.name.includes(""));
        this.selectUser(0);
    }
});