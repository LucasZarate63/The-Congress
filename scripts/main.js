Vue.createApp({

    data() {
        return{
            members: [],
            membersDem:[],
            membersRep:[],
            membersInd:[],
            
            objectTotalMember:[{},{},{},{}],
            partiesSwitch:[],
            arrayAuxParties: [],
            finalArrayFilter:[],
            states:[],
            stateSelect: "all",

            // 
            democratics: 0,
            republicans: 0,
            independents: 0,
            sumPercentDemocratics: 0,
            sumPercentRepublicans: 0,
            sumPercentIndependents: 0,
            sumPercentParties: 0,
            sumTotalPercent: 0,
            totalMembers:0,
            percentByPartyD:0,
            percentByPartyR:0,
            percentByPartyID:0,
            sumTotalPercent:0,
            sumAllPercent:0,

            // 
            auxPercentAttendance: [],
            tenPercent:0,
            orderFinalMostAttendance:0,
            orderFinalLeastAttendance:0,
            // 
            auxPorcentajeLoyal: [],
            orderFinalLeastLoyal: 0,
            orderFinalMostLoyal: 0,
        }
    },


    created(){
        let chamber = document.querySelector(`#senate`) ? "senate" : "house"

        let URLAPI = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`

        let init = {
            method: "GET",
            headers: {
        "X-API-Key" : "XlDkDhEyzOvINkasVpbctcnK3pBfvjlvNqof8rB"
    }}

        fetch(URLAPI,init)
            .then(result=>result.json())
            .then(json=>{
                let data = json.results[0].members
                this.members = data
                
            })
            .catch(error=> console.warn(error.message))

    },


    methods:{

    },
    
    
    computed: {
        totalStates(){
            this.states = []
            this.members.forEach(member => {
                !this.states.includes(member.state) ? this.states.push(member.state) : null
            })
            return this.states.sort()
        },

        filter() {
            this.arrayAuxParties = []
            this.partiesSwitch.length == 0 ? this.arrayAuxParties = this.members : this.members.forEach(member => {
                this.partiesSwitch.forEach(check => member.party == check ? this.arrayAuxParties.push(member) : null)
            })

            this.finalArrayFilter = []
            this.stateSelect == "all" ? this.finalArrayFilter = this.arrayAuxParties : this.arrayAuxParties.forEach(member => member.state == this.stateSelect ? this.finalArrayFilter.push(member) : null)
            
            return this.finalArrayFilter
        },
        
        sumAndPercent() {
            this.democratics = 0,
            this.republicans = 0,
            this.independents = 0,
            this.sumPercentDemocratics = 0,
            this.sumPercentRepublicans = 0,
            this.sumPercentIndependents = 0,
            this.sumPercentParties = 0,
            this.sumTotalPercent = 0,
            this.members.forEach(member => {
                    if (member.party === "D") {
                        this.democratics++
                        this.sumPercentDemocratics = this.sumPercentDemocratics + member.votes_with_party_pct
                    } else if (member.party === "R") {
                        this.republicans++
                        this.sumPercentRepublicans = this.sumPercentRepublicans + member.votes_with_party_pct
                    } else if (member.party === "ID") {
                        this.independents++
                        this.sumPercentIndependents = this.sumPercentIndependents + member.votes_with_party_pct
                    }
                    this.sumAllPercent += member.votes_with_party_pct
                })
            this.totalMembers = this.democratics + this.republicans + this.independents
            this.percentByPartyD = this.sumPercentDemocratics / this.democratics
            this.percentByPartyR = this.sumPercentRepublicans / this.republicans
            this.percentByPartyID = this.sumPercentIndependents / this.independents
            this.sumTotalPercent = this.sumAllPercent / this.totalMembers
            if (isNaN(this.percentByPartyID)) {
                this.percentByPartyID = 0
            }
        },

        tableTenPercentAttendance() {
            this.auxPercentAttendance = []
            this.members.forEach(member => {
                if (!this.auxPercentAttendance.includes(member.votes_with_party_pct)) {
                    this.auxPercentAttendance.push(member)
                }
            this.auxPercentAttendance.sort(function (a, b) { return a.missed_votes_pct - b.missed_votes_pct })
            })
            this.tenPercent = Math.floor((this.totalMembers * 0.1)) // la regla de 3
            this.orderFinalMostAttendance = this.auxPercentAttendance.slice(0, this.tenPercent)
            this.orderFinalLeastAttendance = this.auxPercentAttendance.reverse().slice(0, this.tenPercent)
        },

        tableTenPercentLoyal() {
            this.auxPorcentajeLoyal = []
            this.members.forEach(member => {
                if (!this.auxPorcentajeLoyal.includes(member.votes_with_party_pct)) {
                this.auxPorcentajeLoyal.push(member)
                }
                this.auxPorcentajeLoyal.sort(function (a, b) { return a.votes_with_party_pct - b.votes_with_party_pct })
            })
            this.tenPercent = Math.floor((this.totalMembers * 0.1)) // la regla de 3
            this.orderFinalLeastLoyal = this.auxPorcentajeLoyal.slice(0, this.tenPercent)
            this.orderFinalMostLoyal = this.auxPorcentajeLoyal.reverse().slice(0, this.tenPercent)
        }
    }
    
}).mount('#app')
