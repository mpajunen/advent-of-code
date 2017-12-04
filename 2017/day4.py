import common

day = 4
data = common.read_input(day)


def has_unique_words(words):
    return len(set(words)) == len(words)


def solve_unique(phrases):
    processed = common.process_table(
        phrases,
        check_row=has_unique_words,
    )

    return len(processed)


result1 = solve_unique(data)
print(result1)
assert result1 == 383


def sort_word(word):
    return ''.join(sorted(word))


def solve_no_anagrams(phrases):
    processed = common.process_table(
        phrases,
        modify=sort_word,
        check_row=has_unique_words,
    )

    return len(processed)


result2 = solve_no_anagrams(data)
print(result2)
assert result2 == 265
