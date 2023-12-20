# [geisha](../index.md)


## Test

#### format, create data and give it to developer
```
description:
spinData: 
```

#### description example

```
this is a example for scatter payout (2x-5x scatter)
```

#### spinData example
```
{
	"credit":"0.01",
	"cost":"0.09",
	"payout":"2.10",
	"balance":"1000001.26",
	"result":{
		"ss":[[3,3,1],[4,11,1],[3,11,0],[11,2,8],[10,3,6]],
		"sm":20,
		"lm":30,
		"lw":{
			"l2r":[[6,1,3,10,true],[0,3,3,10,true]],
			"r2l":[[8,3,3,10,true]]
		},
		"sw":{
			"r2l":[[4,20,true]]
		}
	}
}
```

#### detail for result
```
credit: per line bet
cost: total bet
payout: win amount
balance:
ss: spin result
sm: win from scatter, like 2x scatter = 1
lm: win from line win, like 3x j = 5
lw: win from line win detail
sw: win from scatter win detail
l2r => left to right
r2l => right to left
[6,1,3,10,true] => [lineId, symbol, count, odd, true]
[4,20,true] => [count, odd, true]
```