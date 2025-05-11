from sklearn.preprocessing import LabelEncoder

class EnhancedEncoder(LabelEncoder):
    def fit_transform(self, data):
        data = super().fit_transform([str(x).lower().strip() for x in data])
        return data

class ConditionEncoder:
    def transform(self, data):
        result = []
        for x in data:
            x_str = str(x).lower().strip()
            if "중고" in x_str:
                result.append(0)
            elif "새" in x_str or "미개봉" in x_str:
                result.append(1)
            else:
                result.append(0)
        return result
    def fit_transform(self, data):
        return self.transform(data)
