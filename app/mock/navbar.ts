export type NavigationData = {
  name: string;
  href: string;
  target?: string;
  childrens?: {
    name: string;
    href: string;
    target?: string;
  }[];
};

export const navigationData: NavigationData[] = [
  { name: "Home", href: "/" },
  {
    name: "Administration",
    href: "#",
    childrens: [
      { name: "Vice Chancellor", href: "/Vice-Chancellor" },
      { name: "Principal", href: "/Principal" },
      { name: "Institute Administration", href: "/Institute_Administration" },
      { name: "Hostel Administration", href: "/Hostel_Adminstration" },
    ],
  },
  {
    name: "Department",
    href: "#",
    childrens: [
      {
        name: "Department of Computer Science & Engineering",
        href: "/CSE-dept",
      },
      {
        name: "Department of Electrical Engineering",
        href: "/EE_dept",
      },
      {
        name: "Department of Civil Engineering",
        href: "/CE_dept",
      },
      {
        name: "Department of Electronics & Communication Engineering",
        href: "/ECE_dept",
      },
      {
        name: "Department of Basic Sciences & Humanities",
        href: "/BSC_dept",
      },
      {
        name: "Department of Mechanical Engineering",
        href: "/ME_dept",
      },
    ],
  },
  {
    name: "Facility",
    href: "#",
    childrens: [
      { name: "Library Facility", href: "/Library_Facility" },
      { name: "Internet Facility", href: "/Internet_Facility" },
      { name: "Hostel Facility", href: "/Hostel_Facility" },
      { name: "Language Lab", href: "/Language_Lab" },
    ],
  },
  {
    name: "Information",
    href: "#",
    childrens: [
      { name: "Fire Safety Certificate", href: "/Fire_Safety_Certificate" },
      { name: "Mandatory Disclosures", href: "/Mandatory_Disclosures" },
      { name: "Ragging", href: "/Ragging" },
      {
        name: "Faculty Development Program",
        href: "/Faculty_Development_Program",
      },
      { name: "Placement", href: "/Placement" },
      { name: "Campus", href: "/Campus" },
      { name: "Classroom", href: "/Classroom_0" },
      {
        name: "Online Grievance Redressal",
        href: "https://manipuruniv.samarth.ac.in/index.php/pgportal/grievance-public/public",
      },
    ],
  },
  {
    name: "Fee Payment",
    href: "#",
    childrens: [
      {
        name: "QFix",
        href: "https://www.eduqfix.com/PayDirect/#/student/pay/7ChovdHUkV4h1iT4e7muzE0DKGyi731lkU+vjeXKBwMrdo2FoeTSb2he6GWGiX6I/2836",
        target: "_blank",
      },
      {
        name: "Samarth",
        href: "https://manipuruniv.samarth.edu.in/feeportal/index.php/site/login",
        target: "_blank",
      },
    ],
  },
  { name: "Form Fillup", href: "https://www.manipuruniv.ac.in/examform2021/" },
  {
    name: "Extras",
    href: "#",
    childrens: [
      {
        name: "Confrence",
        href: "/confrence",
        target: "_blank",
      },
      { name: "NIRF", href: "/NIRF" },
      { name: "Gallery", href: "/gallery" },
      { name: "Contact Us", href: "/Contact_Us" },
    ],
  },
];
