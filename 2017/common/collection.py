def segment_list(values, length):
    return [values[i:i + length] for i in range(0, len(values), length)]
