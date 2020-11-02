// eslint-disable-next-line no-unused-vars
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
        if(item.position==1){
            item.position="PG"
        }else if(item.position==2){
            item.position="SG"
        }else if(item.position==3){
            item.position="SF"
        }else if(item.position==4){
            item.position="PF"
        }else if(item.position==5){
            item.position="C"
        }

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



        if(item.type==0){
            item.type="现役";
        }else{
            item.type="历史";
        }

}