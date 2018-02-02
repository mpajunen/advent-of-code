import string

import common.day as day
from common.prime import is_prime


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
        if position == 8:  # Start of outer loop
            reg['h'] = get_outer_h(reg['b'], reg['c'], reg['h'])
            position = 32
        else:
            row = instructions[position]
            reg, position, instruction = instruct(reg, position, row)

    return reg['h']


def get_outer_h(b_start, c, h):
    for b in range(b_start, c + 1, 17):
        if not is_prime(b):
            h += 1

    return h


def get_outer_h_loop(b, c, h):
    g = -1

    while g != 0:
        if get_mid_f(b) == 0:
            h += 1

        g = b
        g -= c
        b += 17

    return h


def get_mid_f(b):
    return 1 if is_prime(b) else 0


def get_mid_f_loop(b):
    f = 1  # Outside the actual loop
    d = 2  # Outside the actual loop
    g = -1

    while g != 0:
        f = get_inner_f_loop(b, d, f)
        if f == 0:
            return 0

        d += 1

        g = d - b

    return f


def get_inner_f(b, d, f):
    return 0 if b % d == 0 else f


def get_inner_f_loop(b, d, f):
    e = 2  # Outside the actual loop
    g = -1

    while g != 0:
        g = d * e - b
        if g == 0:
            return 0

        e += 1
        g = e - b

    return f


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
