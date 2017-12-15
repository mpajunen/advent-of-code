import operator
import common


def main():
    data = common.read_input(10)

    common.solve_day(
        data,
        (solve1, 1935),
        (solve2, 'dc7e7dee710d4c7201ce42713e6b8359'),
    )


def knot(lengths, element_count=256, iterations=1):
    skip = 0
    position = 0
    elements = list(range(0, element_count))

    for i in range(iterations):
        for length in lengths:
            glued = elements[position:] + elements[:position]
            revved = glued[:length][::-1] + glued[length:]
            elements = revved[-position:] + revved[:-position]

            position = (position + length + skip) % element_count
            skip += 1

    return elements


def solve1(incoming):
    data = common.process_list(
        incoming.split(','),
        modify=int,
    )

    elements = knot(data)

    return elements[0] * elements[1]


def dense(sparse):
    result = 0

    for num in sparse:
        result = operator.xor(result, num)

    return result


def knot_bytes(incoming):
    data = common.process_list(
        list(incoming),
        modify=ord,
    ) + [17, 31, 73, 47, 23]

    elements = knot(data, iterations=64)

    segments = common.segment_list(elements, 16)

    return list(map(dense, segments))


def solve2(incoming):
    hexed = [hex(v)[2:].rjust(2, '0') for v in knot_bytes(incoming)]

    return ''.join(hexed)


if __name__ == "__main__":
    main()
