import math

from pearson import data


# 用户相关度算法-皮尔逊，结果越接近1越相关。
# result between -1 and 1
def sim_pearson(prefs,p1,p2):
    s={}
    for item in prefs[p1]:
        if item in prefs[p2]:
            s[item] = 1

    n=len(s)
    if n==0 :return 1

    sum1 = sum([prefs[p1][it] for it in s])
    sum2 = sum([prefs[p2][it] for it in s])

    sqrt1 = sum([pow(prefs[p1][it],2) for it in s])
    sqrt2 = sum([pow(prefs[p2][it],2) for it in s])

    # 乘积和
    sum3 = sum([prefs[p1][it]*prefs[p2][it] for it in s])

    # pearson相关度
    num = sum3 - (sum1*sum2/n)
    den = math.sqrt((sqrt1-pow(sum1,2)/n)*(sqrt2-pow(sum2,2)/n))
    if den==0: return 0

    result = num/den
    return result

# 用户相关度算法-皮尔逊，结果越接近1越相关。
# result between -1 and 1
def sim_distance(prefs,p1,p2):
    s={}
    for item in prefs[p1]:
        if item in prefs[p2]:
            s[item] = 1

    n=len(s)
    if n==0 :return 1

    sum_square = sum([pow(prefs[p1][item]-prefs[p2][item],2) for item in prefs[p1] if item in prefs[p2]])
    result = 1/(1+math.sqrt(sum_square))
    return result

# 获得用户A的最相关用户。参数：（数据，用户A，top人数，相关度算法）
def topMatch(prefs,person,n=3,similarity=sim_pearson):
    scores = [(similarity(prefs,person,other),other) for other in prefs if other!=person]
    scores.sort()
    scores.reverse()
    return scores[0:n]

# 获得金融产品推荐
def getRecommend(prefs, person, similarity=sim_pearson, user=data.user, n=3):
    totals = {}
    simSums = {}
    for other in prefs:
        if other==person:continue
        # 与每个人的相关度-sim
        if similarity==sim_pearson:
            sim = similarity(prefs,person,other)
        else:
            sim = similarity(user,person,other)
        if(sim<=0):continue
        for item in prefs[other]:
            if person not in prefs or item not in prefs[person] or prefs[person][item]==0:
                totals.setdefault(item,0)
                totals[item]+=prefs[other][item]*sim
                simSums.setdefault(item,0)
                simSums[item]+=sim

    rankings = [(total/simSums[item],item) for item,total in totals.items()]
    rankings.sort()
    rankings.reverse()
    return rankings[0:n]

# 人物目录改成产品目录
def transformPrefs(prefs):
    result = {}
    for person in prefs:
        for item in prefs[person]:
            result.setdefault(item,{})
            result[item].setdefault(person,0)
            result[item][person]=prefs[person][item]

    return result
