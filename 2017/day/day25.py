import common.day as day


def main():
    data = day.read_input('25-simple')

    day.solve_day(
        data,
        (solve, 3099),
    )


def solve(incoming):
    state, steps, *rule_rows = incoming
    rules = build_rules(rule_rows)
    position = 0
    tape = {}

    for _ in range(steps):
        value = tape.get(position, 0)
        tape[position], move, state = rules[(state, value)]
        position += move

    return sum(tape.values())


def build_rules(rows):
    return {(state, current): (
        new_value,
        -1 if move == 'left' else 1,
        new_state
    )
        for state, current, new_value, move, new_state in rows}


if __name__ == "__main__":
    main()
