import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const QuestionHistory = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View style={{ padding: 16 }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Lịch sử hỏi đáp</Text>
                    {/* Add your question history items here */}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default QuestionHistory;