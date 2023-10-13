import React, { useEffect, useState } from "react";
import { useSession, getSession } from "next-auth/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Progress,
  getKeyValue,
} from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { Layout } from "../components/layout/layout";
import { signOut } from "next-auth/react";
import LoadingComponent from "../components/loading";
import { useRouter } from "next/router";
type UserType = "" | "student" | "admin";
interface User {
  key: string;
  name: string;
  email: string;
  type: UserType;
  _id: string;
}

const columns = [
  { key: "name", label: "NAME" },
  { key: "email", label: "EMAIL" },
  { key: "type", label: "TYPE" },
];

const UserManagement = () => {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [userType, setUserType] = useState<string | null>(null);
  const router = useRouter();

  const [selectedTypes, setSelectedTypes] = useState<Map<string, Set<string>>>(
    new Map()
  );

  useEffect(() => {
    if (session) {
      const fetchUserType = async () => {
        const email = (session.user as { email: string }).email;
        if (email) {
          const response = await fetch(
            `/api/db?email=${encodeURIComponent(email)}`
          );
          const data = await response.json();
          setUserType(data.userType);
          if (data.userType === "admin") {
            await fetchUsers(); // move fetchUsers call inside fetchUserType
          }
        }
      };

      const fetchUsers = async () => {
        const response = await fetch("/api/users");
        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
          const initialSelectedTypes = data.users.reduce((acc, user) => {
            acc.set(user._id, new Set([user.type || ""]));
            return acc;
          }, new Map());
          setSelectedTypes(initialSelectedTypes);
        }
      };

      fetchUserType();
    }
  }, [session]);

  const handleUserTypeChange = async (
    userId: string,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newType = event.target.value === "empty" ? "" : event.target.value;

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userId, userType: newType }),
    });

    const data = await res.json();
    if (data.success) {
      setUsers((prevUsers) => {
        return prevUsers.map((user) => {
          if (user._id === userId) {
            return { ...user, type: newType as UserType };
          }
          return user;
        });
      });
      setSelectedTypes((prevSelectedTypes) => {
        const updatedSelectedTypes = new Map(prevSelectedTypes);
        updatedSelectedTypes.set(userId, new Set([newType]));
        return updatedSelectedTypes;
      });
    }
  };

  if (status === "loading" || userType === null) return <LoadingComponent />;
  if (!session) {
    router.push("/login");
    return null;
  }
  if (userType !== "admin" ) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center lowercase">
        <p>You do not have admin privileges.</p>
        <p>Contact Adi to get access (give him your email).</p>
        <Button
          className="mt-4"
          color="danger"
          onClick={() => signOut()}
          variant="light"
        >
          Log Out
        </Button>
      </div>
    );
  }

  return (
    <Layout>
      <Table aria-label="User Management Table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={users}>
          {(user) => (
            <TableRow key={user._id}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === "type" ? (
                    <Select
                      variant="underlined"
                      color="primary"
                      selectedKeys={
                        selectedTypes.get(user._id) || new Set([""])
                      }
                      onChange={(event) =>
                        handleUserTypeChange(user._id, event)
                      }
                    >
                      <SelectItem key="empty" value="">
                        Empty
                      </SelectItem>
                      <SelectItem key="student" value="student">
                        Student
                      </SelectItem>
                      <SelectItem key="admin" value="admin">
                        Admin
                      </SelectItem>
                    </Select>
                  ) : (
                    getKeyValue(user, columnKey)
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}

export default UserManagement;
