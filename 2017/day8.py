import common

day = 8
raw_data = common.read_input(day)


def create_instructions(raw):
    return [(name, func, change, check) for name, func, change, _, *check in raw]


data = create_instructions(raw_data)


def check_check(registers, check):
    name, operator, value = check

    if operator == '==':
        return registers[name] == value
    elif operator == '>=':
        return registers[name] >= value
    elif operator == '<=':
        return registers[name] <= value
    elif operator == '>':
        return registers[name] > value
    elif operator == '<':
        return registers[name] < value
    elif operator == '!=':
        return registers[name] != value
    else:
        print(operator)


def solve1(instructions):
    registers = {name: 0 for name, _, _, _ in instructions}
    highest = 0

    for name, func, change, check in instructions:
        if check_check(registers, check):
            if func == 'inc':
                registers[name] += change
            elif func == 'dec':
                registers[name] -= change
            else:
                print(func)

            highest = max(highest, registers[name])

    return max(registers.values()), highest


result1 = solve1(data)
print(result1)
# assert result1 == 0


def solve2(instructions):
    registers = {name: 0 for name, _, _, _ in instructions}
    result = len(registers)

    return result


result2 = solve2(data)
# print(result2)
# assert result2 == 0
