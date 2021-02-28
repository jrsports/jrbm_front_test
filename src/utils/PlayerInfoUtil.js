// eslint-disable-next-line no-unused-vars
import {formatDate} from "@/utils/date";

export function convertPlayerInfo(item) {

        if(item.order==1){
            item.order="首发PG"
        }else if(item.order==2){
            item.order="首发SG"
        }else if(item.order==3){
            item.order="首发SF"
        }else if(item.order==4){
            item.order="首发PF"
        }else if(item.order==5){
            item.order="首发C"
        }

        let pos="";
        item.position.positionList.forEach(it=>{
            if(it===1){
                pos+="PG/"
            }else if(it===2){
                pos+="SG/"
            }else if(it===3){
                pos+="SF/"
            }else if(it===4){
                pos+="PF/"
            }else if(it===5){
                pos+="C/"
            }
        });
        item.position=pos.substring(0,pos.length-1);

        if(item.grade==1){
            item.grade="S+"
        }else if(item.grade==2){
            item.grade="S"
        }else if(item.grade==3){
            item.grade="S-"
        }else if(item.grade==4){
            item.grade="A+"
        }else if(item.grade==5){
            item.grade="A"
        }else if(item.grade==6){
            item.grade="A-"
        }else if(item.grade==7){
            item.grade="B+"
        }else if(item.grade==8){
            item.grade="B"
        }else if(item.grade==9){
            item.grade="B-"
        }else if(item.grade==10){
            item.grade="C+"
        }else if(item.grade==11){
            item.grade="C"
        }else if(item.grade==12){
            item.grade="C-"
        }else if(item.grade==13){
            item.grade="D+"
        }else if(item.grade==14){
            item.grade="D"
        }else if(item.grade==15){
            item.grade="D-"
        }



        if(item.basicPlayerType===1){
            item.type="现役";
        }else{
            item.type="历史";
        }


        if(item.draftInfo!=null){
            item.draftInfo.content="于 "+formatDate(new Date(item.draftInfo.pickTime), "yyyy-MM-dd hh:mm:ss")+" 在第"+item.draftInfo.draftOrder+"顺位 被 "+item.draftInfo.teamName+" 选中";
        }else{
            item.draftInfo={};
            item.draftInfo.content="无选秀记录";
        }

        item.contract.content = item.contract.totalYear + "年" + item.contract.totalSalary + "万";

        let cp=item.contract.progress;
        item.contract.detail.forEach((it,index)=>{
            if(cp>0 && index===cp-1){
                it.progress="履行中";
            }else if(cp>0 && index<cp-1 || cp<0 &&index<=-cp){
                it.progress="履行完毕";
            }else {
                it.progress="未履行";
            }
        });

}