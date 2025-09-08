import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    FlatList,
    Image,
    ListRenderItem,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// 1. Định nghĩa type cho Message
interface Message {
    id: string;
    name: string;
    message: string;
    time: string;
    avatar: string;
}

// 2. Data mẫu
const messages: Message[] = [
    {
        id: "1",
        name: "Alice",
        message: "Hey, how are you?",
        time: "10:45 AM",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
        id: "2",
        name: "Bob",
        message: "Let's catch up tomorrow!",
        time: "09:30 AM",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        id: "3",
        name: "Charlie",
        message: "Got it, thanks 👍",
        time: "Yesterday",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
];

// 3. Component item với props typing
interface MessageItemProps {
    item: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.textContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.message} numberOfLines={1}>
                {item.message}
            </Text>
        </View>
        <View style={styles.metaContainer}>
            <Text style={styles.time}>{item.time}</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
        </View>
    </TouchableOpacity>
);

// 4. Main screen
const MessageScreen: React.FC = () => {
    const renderItem: ListRenderItem<Message> = ({ item }) => (
        <MessageItem item={item} />
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Messages</Text>
                <Ionicons name="create-outline" size={24} color="#000" />
            </View>

            {/* List */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
};

export default MessageScreen;

// 5. Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "600",
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
    },
    message: {
        fontSize: 14,
        color: "#555",
        marginTop: 2,
    },
    metaContainer: {
        alignItems: "flex-end",
    },
    time: {
        fontSize: 12,
        color: "#999",
        marginBottom: 4,
    },
    separator: {
        height: 1,
        backgroundColor: "#eee",
        marginLeft: 78,
    },
});
