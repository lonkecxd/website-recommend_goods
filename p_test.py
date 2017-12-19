from intellij import data, recommend as re

# 已有购买记录
print('两用户相关度(0-1)：\n', re.sim_pearson(data.prefs, 'cxd', 'syq'))
print('与【cxd】最相关的用户(相关度，用户名)：\n', re.topMatch(data.prefs, 'cxd'))
print('为【cxd】推荐的产品：\n', re.getRecommend(data.prefs, 'cxd'))
print('\n')
products = re.transformPrefs(data.prefs)
print('与【基金A】最相关的产品\n',re.topMatch(products,'基金A'))
print('为【基金X】推荐的潜在用户\n',re.getRecommend(products,'基金X'))
print('\n')
# 未有购买记录
print('两用户相关度(0-1)：\n', re.sim_distance(data.user, 'cxd', 'new'))
print('与【new】最相关的用户(相关度，用户名)：\n', re.topMatch(data.user, 'new', similarity=re.sim_distance))
top1 = re.topMatch(data.user, 'new', 1, similarity=re.sim_distance)[0]
print(top1[1])
print('为【new】推荐的产品：\n', re.getRecommend(data.prefs, 'new', re.sim_distance))

prefs = re.loadMovielens()
movies = re.transformPrefs(prefs)
print(re.getRecommend(movies,'Wrong Cops (2013)')[0:30])
print(re.getRecommend(prefs,'87')[0:30])

# 基于产品的协作过滤
itemsdict = re.calculateItems(prefs) #后台运行，非常慢
print(re.getRecommendedItems(prefs,itemsdict,'87')[0:30]) #非常快，比基于用户的协作过滤快

