export type FooterNavigationData = {
  title: string;
  links: {
    name: string;
    href: string;
    target?: string;
  }[];
};

export const footerNavigationData: FooterNavigationData[] = [
  {
    title: "Department",
    links: [
      {
        name: "Department of Civil Engineering",
        href: "/CE_dept",
      },
      {
        name: "Department of Electronics & Communication Engineering",
        href: "/ECE_dept",
      },
      {
        name: "Department of Computer Science & Engineering",
        href: "/CSE_dept",
      },
      {
        name: "Department of Basic Sciences & Humanities",
        href: "/BSH_dept",
      },
      {
        name: "Department of Mechanical Engineering",
        href: "/ME_dept",
      },
      {
        name: "Department of Electrical Engineering",
        href: "/EE_dept",
      },
    ],
  },

  {
    title: "Facility",
    links: [
      {
        name: "Library Facility",
        href: "/Library_Facility",
      },
      {
        name: "Internet Facility",
        href: "/Internet_Facility",
      },
      {
        name: "Hostel Facility",
        href: "/Hostel_Facility",
      },
      {
        name: "Language Lab",
        href: "/Language_Lab",
      },
    ],
  },

  {
    title: "Information",
    links: [
      {
        name: "Fire Safety Certificate",
        href: "/Fire_Safety_Certificate",
      },
      {
        name: "Mandatory Disclosures",
        href: "/Mandatory_Disclosures",
      },
      {
        name: "Ragging",
        href: "/Ragging",
      },
      {
        name: "Faculty Development Program",
        href: "/Faculty_Development_Program",
      },
      {
        name: "Placement",
        href: "/Placement",
      },
      {
        name: "Campus",
        href: "/Campus",
      },
      {
        name: "Classroom",
        href: "/Classroom",
      },
      {
        name: "Online Grievance Redressal",
        href: "https://manipuruniv.samarth.ac.in/index.php/pgportal/grievance-public/public",
        target: "_blank",
      },
    ],
  },

  {
    title: "Extras",
    links: [
      {
        name: "Conference",
        href: "/confrence",
      },
      {
        name: "NIRF",
        href: "/NIRF",
      },
      {
        name: "AICTE-VAANI",
        href: "/aicte-vaani",
      },
      {
        name: "Student List",
        href: "/student-list",
      },
      {
        name: "All Notification",
        href: "/all-notifications",
      },
      {
        name: "Gallery",
        href: "/gallery",
      },
      {
        name: "Contact Us",
        href: "/Contact_Us",
      },
    ],
  },
];