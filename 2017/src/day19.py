import string

import common.day as day
from common.grid_square import Dir, Turn, build_char_grid, get_path, move, units_main
from common.string import cat


def main():
    raw_data = day.read_input(19, char_split=True)

    day.solve_day(
        raw_data,
        (solve, ('PVBSCMEQHY', 17736)),
    )


def solve(incoming):
    grid = build_char_grid(incoming)

    position = [(x, y) for (x, y) in grid if y == 0].pop()
    direction = Dir.S

    path = get_path(get_step(grid), position, direction)

    letters = [v for p in path for v in grid[p] if v in set(string.ascii_letters)]

    return cat(letters), len(path)


def get_step(grid):
    # Try moving to the original direction first, then try 90 degree turns.
    possibilities = {d: [d, d.turn(Turn.Left), d.turn(Turn.Right)] for d in units_main}

    def step(position, direction):
        for new_direction in possibilities[direction]:
            new_position = move(position, new_direction)
            if grid.get(new_position):
                return new_position, new_direction

        return position, None  # The path is traversed when there is no direction left to go.

    return step


if __name__ == "__main__":
    main()
