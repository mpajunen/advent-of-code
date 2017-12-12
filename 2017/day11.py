import common

day = 11
raw_data = common.read_input(day)

flat_hex_units = {
    'n': (0, -1),
    'ne': (1, -1),
    'se': (1, 0),
    's': (0, 1),
    'sw': (-1, 1),
    'nw': (-1, 0),
}

data = common.process_list(
    raw_data.split(','),
    modify=lambda x: flat_hex_units[x],
)


def distance(vec):
    q, r = vec
    dq, dr = abs(q), abs(r)

    # Find sectors where a single step can bring us
    # towards the target on both q and r axes.
    if q > 0 > r or r > 0 > q:
        return max(dq, dr)
    else:
        return dq + dr


def solve(incoming):
    dist_q, dist_r = 0, 0
    dist = 0
    max_dist = 0

    for (q, r) in incoming:
        dist_q += q
        dist_r += r

        total = dist_q, dist_r
        dist = distance(total)
        max_dist = max(dist, max_dist)

    return dist, max_dist


result1, result2 = solve(data)
print(result1)
assert result1 == 794

print(result2)
assert result2 == 1524