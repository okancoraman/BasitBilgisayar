new Vue({
    el: '#app',
    data:{
        code: '',
        result:'',
        ac:'',
        pc:0,
        stepby:0,
        adimla:false,
        memory:[
            {name:'',val:''},
            {name:'',val:''},
            {name:'',val:''},
            {name:'',val:''},
            {name:'',val:''},
            {name:'',val:''},
            {name:'',val:''},
            {name:'',val:''},
        ],
        codeline:[],
        counter:0,
        adimbtn:true,
        /*
         Desing: { code:"example goto", val:"", type: 0->code, 1->memory, 2->label, 3->error }
        */
    },
    computed:{
        linecomp: function () {
            pcline='';
            var lines=this.code.split("\n");
            for(var line=0;line<lines.length;line++){
                pcline+=line+"\n";
            }
            return pcline;
        },
    },
    methods:{
        clean(){
            this.codeline=[];
            this.ac='';
            this.pc=0;
            this.stepby=0;
            this.result='';
            this.adimla=false;
            this.adimbtn=true;
            this.memory=[{name:'',val:''},
            {name:'',val:''},
            {name:'',val:''},
            {name:'',val:''},
            {name:'',val:''},
            {name:'',val:''},
            {name:'',val:''},
            {name:'',val:''}];
            this.counter=0;
        },
        globalline(step=false){
            var memory=0;
            if(!step && this.codeline.length==0)
                this.clean();
            if(step)
                this.clean();
            var lines=this.code.split("\n");
            for(var line=0;line<lines.length;line++){
                var x={code:"", val:"", type: 0};
                var memval=lines[line].split(" ");

                if(memval.length==3){
                    x.type=0;
                    x.code=memval[1];
                    x.val=memval[2];
                }
                else if(memval.length==2 && (memval[1]=="get" || memval[1]=="print" || memval[1]=="stop"))
                {
                    x.type=0;
                    x.code=memval[1];
                }
                else if(memory<8 && memval.length==2)
                {
                    x.type=1;
                    x.code=memval[0];
                    x.val=memval[1];
                    this.memory[memory].name=memval[0];
                    this.memory[memory].val=memval[1];
                    memory++;
                    if(memory==8){
                        continue;
                    }
                }
                else if(memval.length==1){
                    x.type=2;
                    x.code=memval[0];
                    x.val=line;
                }
                else{
                    x.type=3;
                    x.code=lines[line];
                }
                this.codeline.push(x);
            }
        },
        stepbystep(){
            if(this.counter>1000)
            {
                alert("Yapılan işlem sayısı 1000 geçtiği için program durduruldu!");
                return;
            }
            if(!this.adimla)
                this.globalline(false);
            if(this.stepby>=this.codeline.length)
                return;
            if(this.codeline[this.stepby].type==3 || this.codeline[this.stepby].type==1){
                this.stepby++;
                return;
            }
            else if(this.codeline[this.stepby].type==0){
                this.stepby=this.prosess(this.stepby);
            }
            this.stepby++;
            this.adimla=true;
            this.counter++;
        },
        gogo(){
            this.globalline(true);
            /*
            Desing: { code:"example goto", val:"", type: 0->code, 1->memory, 2->label, 3->error }
            */
            for(var line=0;line<this.codeline.length;line++){
                this.counter++;
                if(this.counter>1000)
                {
                    alert("Yapılan işlem sayısı 1000 geçtiği için program durduruldu!");
                    return;
                }
                if(this.codeline[line].type==3 || this.codeline[line].type==1)
                    continue;
                else{
                    line=this.prosess(line);
                }
            }
            this.adimbtn=false;
            
        },
        prosess(line){
            switch(this.codeline[line].code){
                case "load":
                    this.load(this.codeline[line].val);
                    break;
                case "get":
                    this.get();
                    break;
                case "print":
                    this.print();
                    break;
                case "store":
                    this.store(this.codeline[line].val);
                    break;
                case "add":
                    this.add(this.codeline[line].val);
                    break;
                case "mod":
                    this.mod(this.codeline[line].val);
                    break;
                case "sub":
                    this.sub(this.codeline[line].val);
                    break;
                case "mul":
                    this.mul(this.codeline[line].val);
                    break;
                case "div":
                    this.div(this.codeline[line].val);
                    break;
                case "goto":
                    line=this.goto(this.codeline[line].val);
                    break;
                case "ifpos":
                    if(this.ifpos())
                        line=this.goto(this.codeline[line].val);
                    break;
                case "ifzero":
                    if(this.ifzero())
                        line=this.goto(this.codeline[line].val);
                    break;
                case "ifneg":
                    if(this.ifneg())
                        line=this.goto(this.codeline[line].val);
                    break;
                case "stop":
                    line=(this.codeline.length+1);
                    break;    
                default:
                    break;
            }
            this.pc=parseInt(line)+1;
            return line;
        },
        get(){var req=prompt("AC yüklenecek değeri giriniz:"); if(req!=null) this.ac=req;},
        print(){this.result=this.result+this.ac+"\n"},
        load(val){if(!isNaN(parseInt(val))){this.ac=val;}else for(i in this.memory) if(this.memory[i].name==val){this.ac=this.memory[i].val;break;}},
        store(val){for(i in this.memory) if(this.memory[i].name==val){this.memory[i].val=this.ac;break;}},
        add(val){this.cal(val,'+');},
        mod(val){if(!isNaN(parseInt(val))){this.ac=parseInt(this.ac)%parseInt(val);}else for(i in this.memory) if(this.memory[i].name==val){this.ac=parseInt(this.ac)%parseInt(this.memory[i].val);break;}},
        sub(val){if(!isNaN(parseInt(val))){this.ac=parseInt(this.ac)-parseInt(val);}else for(i in this.memory) if(this.memory[i].name==val){this.ac=parseInt(this.ac)-parseInt(this.memory[i].val);break;}},
        mul(val){if(!isNaN(parseInt(val))){this.ac=parseInt(this.ac)*parseInt(val);}else for(i in this.memory) if(this.memory[i].name==val){this.ac=parseInt(this.ac)*parseInt(this.memory[i].val);break;}},
        div(val){if(!isNaN(parseInt(val))){this.ac=parseInt(this.ac)/parseInt(val);}else for(i in this.memory) if(this.memory[i].name==val){this.ac=parseInt(this.ac)/parseInt(this.memory[i].val);break;}},
        goto(line){for(i in this.codeline) if(this.codeline[i].code==line){return this.codeline[i].val;}},
        ifpos(){return this.ac>=0;},
        ifzero(){return this.ac==0;},
        ifneg(){return this.ac<0;},
        stop(){},
        cal(val,cal){
            value=0;
            if(!isNaN(parseInt(val)))
                value=val;
            else 
                for(i in this.memory) 
                    if(this.memory[i].name==val)
                    {
                        value=this.memory[i].val;
                        break;
                    }
            switch(cal){
                case '+':
                    this.ac=parseInt(this.ac)+parseInt(value);
                    break;
                case '-':
                    this.ac=parseInt(this.ac)-parseInt(value);
                    break;
                case '*':
                    this.ac=parseInt(this.ac)*parseInt(value);
                    break;
                case '/':
                    this.ac=parseInt(this.ac)/parseInt(value);
                    break;
                case '%':
                    this.ac=parseInt(this.ac)%parseInt(value);
                    break;
                default:
                    break;
            }
        },
    }
});