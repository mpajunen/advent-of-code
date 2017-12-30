import string

import common.day as day


def main():
    data = day.read_input(23, splitter=' ')

    day.solve_day(
        data,
        (solve1, 3969),
        (solve2, 917),
    )


def solve1(incoming):
    registers = create_registers()
    instructed = process(incoming, registers)

    return instructed.count('mul')


def solve2(incoming):
    registers = create_registers()
    registers['a'] = 1

    return solve_h(incoming, registers)


def create_registers(start_value=0):
    registers = {a: start_value for a in string.ascii_lowercase[:8]}

    return registers


def solve_h(instructions, reg, position=0):
    instruction_count = len(instructions)

    while position < instruction_count:
        row = instructions[position]
        reg, position, instruction = instruct(reg, position, row)

    return reg['h']


def process(instructions, registers, position=0):
    instructed = []
    instruction_count = len(instructions)

    while position < instruction_count:
        row = instructions[position]
        registers, position, instruction = instruct(registers, position, row)

        instructed.append(instruction)

    return instructed


def instruct(registers, position, row):
    instruction, register, x, y = build_instruction(registers, row)
    move = 1

    if instruction == 'set':
        registers[register] = y
    elif instruction == 'sub':
        registers[register] -= y
    elif instruction == 'mul':
        registers[register] *= y
    elif instruction == 'jnz':
        if x != 0:
            move = y
    else:
        print(instruction)

    return registers, position + move, instruction


def build_instruction(registers, row):
    instruction, x, y = row

    def get_reg_and_value(param):
        if isinstance(param, str):
            return param, registers[param]
        else:
            return None, param

    x_register, x_value = get_reg_and_value(x)
    _, y_value = get_reg_and_value(y)

    return instruction, x_register, x_value, y_value


if __name__ == "__main__":
    main()
