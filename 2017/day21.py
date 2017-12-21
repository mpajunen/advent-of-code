import common.day as day
from common.matrix import flip_vertical, get_rotations
from common.string import cat


def main():
    raw_data = day.read_input(21, splitter=' => ')
    data = day.process_table(
        raw_data,
        modify=lambda v: tuple(v.split('/')),
    )

    day.solve_day(
        data,
        (solve1, 194),
        (solve2, 2536879),
    )


def solve1(incoming): return solve(incoming, 5)


def solve2(incoming): return solve(incoming, 18)


def solve(rules, iterations):
    output_map = create_output_map(rules)
    pixels = ('.#.', '..#', '###')

    for _ in range(0, iterations):
        pixels = enhance_detail(output_map, pixels)

    return lit_count(pixels)


def enhance_detail(output_map, pixels):
    block_size = 2 + len(pixels) % 2  # 2 if even, 3 if odd

    enhanced = [[output_map[block] for block in row]
                for row in create_blocks(pixels, block_size)]

    return combine_blocks(enhanced, block_size + 1)


def lit_count(pixels):
    return sum([row.count('#') for row in pixels])


def create_blocks(pixels, size):
    block_side = range(0, len(pixels), size)

    def get_row(rows):
        return [tuple([row[j:j + size] for row in rows])
                for j in block_side]

    return [get_row(pixels[i:i + size]) for i in block_side]


def combine_blocks(block_table, size):
    return [cat([b[i] for b in blocks])
            for blocks in block_table
            for i in range(size)]


def create_output_map(patterns):
    return {permutation: out
            for (in_pattern, out) in patterns
            for permutation in pattern_permutations(in_pattern)}


def pattern_permutations(pattern):
    rotations = [tuple(map(lambda row: cat(row), r)) for r in get_rotations(pattern)]

    return set(rotations + [flip_vertical(r) for r in rotations])


if __name__ == "__main__":
    main()
