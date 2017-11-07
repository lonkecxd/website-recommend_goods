/**
 * Created by jasonchen on 2017.10.30.
 */
// 相关度算法——皮尔逊
exports.sim_pearson = function (prefs, name1, name2) {
    let p1=0,p2=0;
    prefs.forEach ((item,i)=>{
        if(item[0].uname===name1){
            p1=i;
            return;
        }else if(item[0].uname===name2){
            p2=i;
            return;
        }
    });
    console.log(p1);
    console.log(p2);

    let temp1 = prefs[p1].filter((d,i)=>{
        let flag = false;
        for(let i=0;i<prefs[p2].length;i++){
            if(prefs[p2][i].pid===d.pid){
                flag = true;
                break;
            }
        }
        return flag;
    });
    let temp2 = prefs[p2].filter((d,i)=>{
        let flag = false;
        for(let i=0;i<prefs[p1].length;i++){
            if(prefs[p1][i].pid===d.pid){
                flag = true;
                break;
            }
        }
        return flag;
    });

    if (temp1.length===0) return 1;
    if (temp2.length===0) return 1;
    let n = temp1.length+temp2.length;
    if (n===0) return 1;

    let sum1 = 0;
    let sum2 = 0;
    prefs[p1].forEach((d)=>{sum1+=d.views});
    prefs[p2].forEach((d)=>{sum2+=d.views});

    let sqrt1 = 0;
    let sqrt2 = 0;
    prefs[p1].forEach((d)=>{sqrt1+=d.views*d.views});
    prefs[p2].forEach((d)=>{sqrt2+=d.views*d.views});
    //
    // 乘积和
    let sum3 = 0;
    for(let k =0;k<temp1.length;k++){
        sum3+=temp1[k].views*temp2[k].views;
    }
    //
    // pearson相关度
    let num = sum3 - (sum1*sum2/n);
    let den = Math.sqrt((sqrt1-Math.pow(sum1,2)/n)*(sqrt2-Math.pow(sum2,2)/n));
    if (den===0) return 0;
    //
    let uu = num/den;
    return num/den;
};

// 相关度算法——欧几里得距离
exports.sim_distance = function (prefs, name1, name2) {
    let p1=0,p2=0;
    prefs.forEach ((item,i)=>{
        if(item[0].uname===name1){
            p1=i;
            return;
        }else if(item[0].uname===name2){
            p2=i;
            return;
        }
    });
    console.log(p1);
    console.log(p2);

    let temp1 = prefs[p1].filter((d,i)=>{
        let flag = false;
        for(let i=0;i<prefs[p2].length;i++){
            if(prefs[p2][i].pid===d.pid){
                flag = true;
                break;
            }
        }
        return flag;
    });
    let temp2 = prefs[p2].filter((d,i)=>{
        let flag = false;
        for(let i=0;i<prefs[p1].length;i++){
            if(prefs[p1][i].pid===d.pid){
                flag = true;
                break;
            }
        }
        return flag;
    });

    if (temp1.length===0) return 1;
    if (temp2.length===0) return 1;
    let n = temp1.length+temp2.length;
    if (n===0) return 1;

    let sum_square = 0;
    for(let k =0;k<temp1.length;k++){
        sum_square+=Math.pow(temp1[k].views-temp2[k].views,2);
    }

    return 1/(1+Math.sqrt(sum_square));
};

// TopN 相关用户
exports.topMatch = function (prefs, person, n = 3, similarity = this.sim_pearson) {
    let p1=0;
    prefs.forEach ((item,i)=>{
        if(item[0].uname===person){
            p1=i;
            return;
        }
    });

    let scores = [];
    for(let i=0;i<prefs.length;i++){
        if(i!==p1){
            scores.push({sim:similarity(prefs,person,prefs[i][0].uname),name:prefs[i][0].uname})
        }
    }
    scores.sort((a,b)=>{
        if(a.sim>b.sim){
            return -1;
        }else {
            return 1;
        }
    });
    return scores.splice(0,n);
};

// TopN 推荐产品（未购买）
exports.getRecommend = function (prefs,person,similarity=this.sim_pearson,users=null,n=3){
    let totals = [];
    let simSums = [];
    let RankedProduct = [];
    let sim = 0;
    let newperson = true;
    let myproduct = [];
    let result = [];
    // let p1 = 0;
    for(let i=0;i<prefs.length;i++){
        if(prefs[i][0].uname===person) {
            newperson = false;
            // p1 = i;
            for(let j=0;j<prefs[i].length;j++) {
                myproduct.push(prefs[i][j].pid);
            }
            break;
        }
    }
    console.log('myproduct',myproduct);
    for(let i=0;i<prefs.length;i++){
        if(prefs[i][0].uname===person) continue;
        if (similarity===this.sim_pearson){
            sim = similarity(prefs,person,prefs[i][0].uname)
        }else{
            sim = similarity(users,person,prefs[i][0].uname)
        }
        for(let j=0;j<prefs[i].length;j++){
            // 是新人，或者没有看过产品
            if(newperson || myproduct.indexOf(prefs[i][j].pid)<0 ) {
                // totals[prefs[i][j].pid] = 0;
                // simSums[prefs[i][j].pid] = 0;
                totals[j] = 0;
                simSums[j] = 0;
                RankedProduct.push(prefs[i][j].pid);
            }
        }
        for(let j=0;j<prefs[i].length;j++){
            // 是新人，或者没有看过产品
            if(newperson || myproduct.indexOf(prefs[i][j].pid)<0 ) {
                totals[j]+=prefs[i][j].views*sim;
                simSums[j]+=sim;
            }
        }
    }
    console.log(totals);
    console.log(simSums);

    for(let i=0;i<totals.length;i++){
        result.push({commRank:totals[i]/simSums[i],pid:RankedProduct[i]});
    }
    result.sort((a,b)=>{
        if(a.commRank>b.commRank){
            return -1;
        }else {
            return 1;
        }
    });
    return result.splice(0,n);
};