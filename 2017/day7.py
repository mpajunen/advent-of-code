import common
from collections import Counter

day = 7
data = common.read_input(day)


def build_programs(raw):
    return {name: (
        int(cost[1:-1]),
        [child.replace(',', '') for child in rest[1:]]
    ) for (name, cost, *rest) in raw}


def solve1(programs):
    all_children = set(sum([children for (_, children) in programs.values()], []))
    roots = programs.keys() - all_children

    return list(roots)[0]


program_map = build_programs(data)

result1 = solve1(program_map)
print(result1)
assert result1 == 'qibuqqg'


def get_totals(programs):
    def get_total(name):
        (weight, children) = programs[name]

        return weight + sum(map(get_total, children))

    return {name: get_total(name) for name in programs.keys()}


def solve2(programs):
    totals = get_totals(programs)

    def is_unbalanced(program):
        (_, children) = program
        child_weights = [totals[child] for child in children]

        return len(set(child_weights)) > 1

    unbalanced = {k: v for k, v in programs.items() if is_unbalanced(v)}

    candidates = [children for k, (_, children) in unbalanced.items() if len(children & unbalanced.keys()) == 0][0]

    candidate_totals = {name: totals[name] for name in candidates}

    ((mode, _), (total, _)) = Counter(candidate_totals.values()).most_common()

    source = [k for k, v in candidate_totals.items() if v == total][0]

    return programs[source][0] + (mode - total)


result2 = solve2(program_map)
print(result2)
assert result2 == 1079
