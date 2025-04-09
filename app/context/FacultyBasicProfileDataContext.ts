import { createContext } from "react";
import type { FacultyBasicProfile } from "~/types/api/faculty.type";

export const FacultyBasicProfileDataContext = createContext<
  FacultyBasicProfile | undefined
>(undefined);
