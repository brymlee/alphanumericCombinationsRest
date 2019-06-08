exports.alphanumericCombinationsRest = (request, response) => {
	//const combinations = combinations(2, 10)
	response
		.status(200)
		.append('Content-Type', 'text/csv')
		.append('Content-Disposition', 'attachment')
		.append('filename', '"combinations.csv"')
		.send("Base,Digits,Results\n" + 
		      request.query.base + "," + request.query.digits + "," + "FF\n" + 
	    	      ",,GG\n")
}
const alphaMap = [
	{ id: 0, alpha: 'A' },
	{ id: 1, alpha: 'B' },
	{ id: 2, alpha: 'C' },
	{ id: 3, alpha: 'D' },
	{ id: 4, alpha: 'E' },
	{ id: 5, alpha: 'F' },
	{ id: 6, alpha: 'G' },
	{ id: 7, alpha: 'H' },
	{ id: 8, alpha: 'I' },
	{ id: 9, alpha: 'J' },
	{ id: 10, alpha: 'K' },
	{ id: 11, alpha: 'L' },
	{ id: 12, alpha: 'M' },
	{ id: 13, alpha: 'N' },
	{ id: 14, alpha: 'O' },
	{ id: 15, alpha: 'P' },
	{ id: 16, alpha: 'Q' },
	{ id: 17, alpha: 'R' },
	{ id: 18, alpha: 'S' },
	{ id: 19, alpha: 'T' },
	{ id: 20, alpha: 'U' },
	{ id: 21, alpha: 'V' },
	{ id: 22, alpha: 'Q' },
	{ id: 23, alpha: 'W' },
	{ id: 24, alpha: 'X' },
	{ id: 25, alpha: 'Y' },
	{ id: 26, alpha: 'Z' }
]
const alpha = /^[A-Z]+$/
const range = (closed, open, numbers) => {
	if(closed >= open){
		return numbers
	}else if(closed + 1 === open){
		return numbers.concat([closed])
	}else{
		return range(closed + 1, open, numbers.concat([closed]))
	}
}
exports.counter = (target, base) => {
	const alphaSmallCase = /^[a-z]+$/
	const countAndCarry = (numberfiedDigits, index, doCountUp) => {
		if(index < 0){
			return numberfiedDigits
		}else if(doCountUp){
			const newNumberfiedDigits = numberfiedDigits
				.map(digit => {
					if(digit.index === index){
						const nextDigitValue = digit.value + 1
						const isDigitAtBase = nextDigitValue === base
						return { 
							index: digit.index, 
							value: isDigitAtBase ? 0 : nextDigitValue,
							carry: isDigitAtBase
						} 
					}else{
						return {
							index: digit.index,
							value: digit.value,
							carry: false
						}
					}
				})
			const isCarrying = newNumberfiedDigits.some(digit => digit.carry)
			const falseOutCarries = newNumberfiedDigits
				.map(digit => {
					return {
						index: digit.index,
						value: digit.value,
						carry: digit.index === 0 ? digit.carry : false
					}
				})
			const carryLastIndex = falseOutCarries[0].carry
			if(isCarrying && !carryLastIndex){
				return countAndCarry(falseOutCarries, index - 1, true)
			}else if(isCarrying && carryLastIndex){
				return countAndCarry(
					[{
						index: 0,
						value: 1,
						carry: false
					}]
					.concat(falseOutCarries)
					.map(digit => {
						return {
							index: digit.index + 1,
							value: digit.value,
							carry: false
						}
					}), index, false)
			}else{
				return countAndCarry(falseOutCarries, index - 1, false)
			}
		}else{
			return numberfiedDigits
		}
	}
	if(base > 10){
		const numberfiedDigits = target.toString().split('')
			.filter(character => character != '' && character != ' ')
			.map(character => {
				if(character.match(alphaSmallCase)){
					return character.toUpperCase()
				}else{
					return character
				}
			}).map(character => {
				if(character.match(alpha)){
					return alphaMap
						.find(mapping => mapping.alpha === character)
						.id + 10
				}else{
					return parseInt(character)
				}
			})
		const numberfiedDigitEntities = range(0, numberfiedDigits.length, [])
			.map(index => {
				return {
					index: index,
					value: numberfiedDigits[index],
					carry: false
				}
			})
		return countAndCarry(numberfiedDigitEntities, numberfiedDigitEntities.length - 1, true)
			.map(digit => {
				if(digit.value >= 10){
					return alphaMap
						.find(mapping => mapping.id === digit.value - 10)
						.alpha
				}else{
					return digit.value.toString()
				}
			}).reduce((accumulator, currentValue) => accumulator + currentValue)
	}else{
		return (parseInt(target) + 1).toString()
	}
}

exports.countTill = (end, base) => {
	const countTill = (index, end, base, numbers) => {
		const trueIndex = index != undefined ? index : 0 
		if(trueIndex === end 
		|| trueIndex.length > end.length){
			return numbers
		}else{
			const newNumber = exports.counter(trueIndex, base)
			const newNumbers = numbers.concat([newNumber])
			return countTill(newNumber, end, base, newNumbers)
		}
	}
	return countTill(undefined, end, base, [])
}

exports.combinations = (hand, base) => {
	const numeric = /^[0-9]+$/
	const toValue = (character) => {
		if(character.match(numeric)){
			return character
		}else if(character.match(alpha)){
			return alphaMap.find(map => map.alpha === character).id
		}
	}
	const toMapId = (sortedNumber) => {
		const removeDuplicateCharacters = (sortedNumber, mapId, index, lastCharacter) =>{
			const getCurrentCharacter = () => sortedNumber[index]
			if(index >= sortedNumber.length){
				if(mapId.length < hand){
					return '0'.repeat(hand - mapId.length) + mapId
				}else{
					return mapId
				}
			}else if(getCurrentCharacter() != lastCharacter){
				return removeDuplicateCharacters(sortedNumber, mapId + getCurrentCharacter(), index + 1, getCurrentCharacter()) 
			}else{
				return removeDuplicateCharacters(sortedNumber, mapId, index + 1, getCurrentCharacter())
			}
		}
		return removeDuplicateCharacters(sortedNumber, '', 0, '') 
	}
	const removeDuplicates = (unsortedNumbers, sortedNumbers) => {
		const removeDuplicates = (unsortedNumbers, sortedNumbers, index, map) => {
			if(index >= unsortedNumbers.length){
				return map
			}else{
				const unsortedNumber = unsortedNumbers[index]
				const sortedNumber = sortedNumbers[index]
				const mapId = toMapId(sortedNumber)
				if(map.some(mapping => mapping.mapId === mapId)){
					return removeDuplicates(unsortedNumbers, sortedNumbers, index + 1, map)
				}else{
					const newMap = map.concat([{
						unsortedNumber: unsortedNumber,
						mapId: mapId
					}])
					return removeDuplicates(unsortedNumbers, sortedNumbers, index + 1, newMap)
				}
			}
		}
		return removeDuplicates(unsortedNumbers, sortedNumbers, 0, [])
			.map(mapping => mapping.unsortedNumber)
	}
	const end = '1' + ('0'.repeat(hand))
	const unsortedNumbers = exports.countTill(end, base)
	const sortedNumbers = unsortedNumbers
		.map(number => {
			const newNumber = number
				.split('')
				.sort((a, b) => {
					const aValue = toValue(a) 
					const bValue = toValue(b)
					if(aValue < bValue){
						return -1
					}else if(aValue === bValue){
						return 0
					}else{
						return 1
					}
				}).reduce((accumulator, currentValue) => accumulator + currentValue)
			if(newNumber.length < hand){
				return '0'.repeat(hand - newNumber.length) + newNumber 
			}else{
				return newNumber
			}
		})
	return removeDuplicates(unsortedNumbers, sortedNumbers)
}
