import type { User, Teammate } from "@/types";
import { getAllDocs, queryDocs } from "@/lib/firebase/db";
import { where } from "firebase/firestore";

// Fallback mock data for initial experience
const MOCK_USERS: User[] = [
  { id: "user-1", name: "Arjun Mehta", college: "IIT Delhi", skills: ["React", "Node.js", "Python"], score: 2840, solved: 342, streak: 47, avatar: "AM", color: "#6C3BFF" },
  { id: "user-2", name: "Priya Sharma", college: "NIT Trichy", skills: ["ML", "Python", "TensorFlow"], score: 2650, solved: 289, streak: 33, avatar: "PS", color: "#10B981" },
  { id: "user-3", name: "Rohit Kumar", college: "BITS Pilani", skills: ["C++", "DSA", "Rust"], score: 2510, solved: 418, streak: 21, avatar: "RK", color: "#F59E0B" },
  { id: "user-4", name: "Anika Singh", college: "VIT Vellore", skills: ["UI/UX", "Figma", "React"], score: 2380, solved: 197, streak: 15, avatar: "AS", color: "#EF4444" },
  { id: "user-5", name: "Dev Patel", college: "IIIT Hyderabad", skills: ["Go", "Docker", "K8s"], score: 2210, solved: 231, streak: 62, avatar: "DP", color: "#8B5CF6" },
];

const MOCK_TEAMMATES: Teammate[] = [
  { id: "teammate-1", name: "Kavya Reddy", college: "IIT Madras", skills: ["Flutter", "Firebase", "UI/UX"], match: 94, hackathons: 8, rating: 4.9, looking: "Team Member", avatar: "KR", color: "#10B981" },
  { id: "teammate-2", name: "Sai Kiran", college: "NIT Warangal", skills: ["Python", "ML", "FastAPI"], match: 87, hackathons: 12, rating: 4.7, looking: "Team Member", avatar: "SK", color: "#6C3BFF" },
  { id: "teammate-3", name: "Ishaan Roy", college: "Jadavpur Univ", skills: ["React", "TypeScript", "AWS"], match: 81, hackathons: 5, rating: 4.8, looking: "Has 2 Spots", avatar: "IR", color: "#F59E0B" },
  { id: "teammate-4", name: "Tanvi Joshi", college: "DAIICT", skills: ["Blockchain", "Solidity", "Web3"], match: 76, hackathons: 9, rating: 4.6, looking: "Has 1 Spot", avatar: "TJ", color: "#EF4444" },
];

/**
 * Get all users from Firebase
 */
export async function getUsers(): Promise<User[]> {
  try {
    const users = await getAllDocs<User>("users");
    return users.length > 0 ? users : MOCK_USERS;
  } catch (error) {
    console.error("Error fetching users from Firebase, using mock data:", error);
    return MOCK_USERS;
  }
}

/**
 * Get all teammates from Firebase
 */
export async function getTeammates(): Promise<Teammate[]> {
  try {
    const teammates = await getAllDocs<Teammate>("teammates");
    return teammates.length > 0 ? teammates : MOCK_TEAMMATES;
  } catch (error) {
    console.error("Error fetching teammates from Firebase, using mock data:", error);
    return MOCK_TEAMMATES;
  }
}

/**
 * Get public teammate profiles from Firestore users collection
 */
export async function getPublicTeammates(): Promise<Teammate[]> {
  try {
    const publicUsers = await queryDocs<User>("users", [where("publicProfile", "==", true)]);

    if (publicUsers.length === 0) {
      return MOCK_TEAMMATES;
    }

    return publicUsers.map((user, index) => ({
      id: user.id,
      name: user.name,
      college: user.college || "Unknown College",
      skills: user.skills || [],
      match: Math.max(70, 95 - index * 4),
      hackathons: user.solved ? Math.max(0, Math.floor(user.solved / 10)) : 0,
      rating: 4.5,
      looking: user.allowTeamRequests === false ? "Profile Only" : "Open to Requests",
      avatar: user.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase(),
      color: ["#10B981", "#6C3BFF", "#F59E0B", "#EF4444", "#8B5CF6"][index % 5],
    }));
  } catch (error) {
    console.error("Error fetching public teammates from Firebase, using mock data:", error);
    return MOCK_TEAMMATES;
  }
}

// Export mock data for direct use in client components
export const USERS: User[] = MOCK_USERS;
export const TEAMMATES: Teammate[] = MOCK_TEAMMATES;
