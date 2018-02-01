from enum import IntEnum

import common.day as day
from common.grid_square import Dir, Turn, move


class S(IntEnum):  # State
    Clean = 1
    Infected = 2
    Weakened = 3
    Flagged = 4


turns = {
    S.Infected: Turn.Right,
    S.Clean: Turn.Left,
    S.Flagged: Turn.Around,
    S.Weakened: Turn.No,
}

new_direction = {(state, direction): direction.turn(turns[state])
                 for state in S
                 for direction in Dir if direction.is_main()}


def main():
    data = day.read_input(22, char_split=True)

    day.solve_day(
        data,
        (solve1, 5182),
        (solve2, 2512008),
    )


def solve1(incoming, burst_count=10000):
    state_changes = {
        S.Clean: S.Infected,
        S.Infected: S.Clean,
    }

    return solve(incoming, state_changes, burst_count)


def solve2(incoming, burst_count=10000000):
    state_changes = {
        S.Clean: S.Weakened,
        S.Weakened: S.Infected,
        S.Infected: S.Flagged,
        S.Flagged: S.Clean,
    }

    return solve(incoming, state_changes, burst_count)


def solve(node_table, state_changes, burst_count):
    direction = Dir.N
    nodes = build_nodes(node_table)
    position = start_position(node_table)

    infect_count = 0

    for _ in range(burst_count):
        state = nodes.get(position, S.Clean)

        direction = new_direction.get((state, direction))
        nodes[position] = new_state = state_changes[state]
        position = move(position, direction)

        if new_state == S.Infected:
            infect_count += 1

    return infect_count


def start_position(node_table):
    size = len(node_table)
    center = (size - 1) // 2

    return center, -center


def build_nodes(raw):
    return {(x, -y): S.Infected  # Unit vector for south: (0, -1), y increases toward south
            for y, row in enumerate(raw)
            for x, node in enumerate(row) if node == '#'}


if __name__ == "__main__":
    main()
