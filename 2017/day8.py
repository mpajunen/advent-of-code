import common.day as common


def main():
    raw_data = common.read_input(8)
    instructions = create_instructions(raw_data)

    common.solve_day(
        instructions,
        (solve, (2971, 4254)),
    )


def create_instructions(raw):
    return [(name, func, change, check) for name, func, change, _, *check in raw]


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


def solve(instructions):
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


if __name__ == "__main__":
    main()
