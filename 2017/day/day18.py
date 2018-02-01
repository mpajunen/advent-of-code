import string

import common.day as day


def main():
    raw_data = day.read_input(18)
    data = day.process_list(
        raw_data,
        modify=lambda v: [*v, None] if len(v) == 2 else v,
    )

    day.solve_day(
        data,
        (solve1, 9423),
        (solve2, 7620),
    )


def solve1(incoming):
    program = create_program()

    while True:
        program = instruct(incoming, program, queue(program))

        _, _, received_count, queued = program
        if received_count > 0:
            return queued.pop()


def solve2(incoming):
    programs = [create_program(i) for i in [0, 1]]

    previous = None
    current = [0, 0]

    while previous != current:
        previous = current.copy()

        for i, j in [(0, 1), (1, 0)]:
            programs[i] = instruct(incoming, programs[i], queue(programs[j]))
            current[i] = position(programs[i])

    return len(queue(programs[1]))


def create_program(start_value=0):
    registers = {a: start_value for a in string.ascii_lowercase}

    return registers, 0, 0, []  # registers, position, received, queue


def position(program): return program[1]


def queue(program): return program[3]


def instruct(instructions, current, receiving):
    registers, start, received_count, out = current
    instruction, register, x, y = get_instruction(instructions, registers, start)
    move = 1

    if instruction == 'snd':
        if x > 0:
            out.append(x)
    elif instruction == 'set':
        registers[register] = y
    elif instruction == 'add':
        registers[register] += y
    elif instruction == 'mul':
        registers[register] *= y
    elif instruction == 'mod':
        registers[register] %= y
    elif instruction == 'rcv':
        if len(receiving) > received_count:
            registers[register] = receiving[received_count]
            received_count += 1
        else:
            move = 0
    elif instruction == 'jgz':
        if x > 0:
            move = y
    else:
        print(instruction)

    return registers, start + move, received_count, out


def get_instruction(instructions, registers, i):
    def get_reg_and_value(param):
        if isinstance(param, str):
            return param, registers[param]
        else:
            return None, param

    instruction, x, y = instructions[i]

    x_register, x_value = get_reg_and_value(x)
    _, y_value = get_reg_and_value(y)

    return instruction, x_register, x_value, y_value


if __name__ == "__main__":
    main()
