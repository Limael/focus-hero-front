export type Gender = "male" | "female" | "other";

export type ChildUser = {
  id: number;
  name: string;
  email: string;
  role: "child";
  gender: Gender;
};

export type ParentChildRelation = {
  parentId: number;
  childId: number;
  child: ChildUser;
};

export type GetChildrenResponse = ParentChildRelation[];


export type UserRole = "parent" | "child" | "psychologist";

export type UserBase = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  gender: Gender;
};


export type UpdateUserInput = Partial<{
  name: string;
  email: string;
  password: string;
  role: UserRole;
  gender: Gender;
}>;
