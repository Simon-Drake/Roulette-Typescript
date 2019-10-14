import random, math


def inside(tup):
    return math.sqrt(tup[0]**2 + tup[1]**2) > 5


radius = 6
for i in range(0,100):
    rnd1 = random.random()
    a = rnd1 * 2 * math.pi
    rnd2 = random.random()
    r = radius * math.sqrt(rnd2)
    if inside((r*math.cos(a), r*math.sin(a))):
        print((r*math.cos(a), r*math.sin(a)))

