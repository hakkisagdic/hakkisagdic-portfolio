import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

interface LinkedInPosition {
  "Company Name": string;
  Title: string;
  Description?: string;
  Location?: string;
  "Started On": string;
  "Finished On"?: string;
}

interface LinkedInEducation {
  "School Name": string;
  "Degree Name": string;
  Notes?: string;
  "Start Date": string;
  "End Date"?: string;
}

interface LinkedInSkill {
  Name: string;
}

interface LinkedInProfile {
  "First Name": string;
  "Last Name": string;
  Headline?: string;
  Summary?: string;
  "Email Address"?: string;
}

// Parse CSV content
function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].match(/("([^"]*)"|[^,]*)/g) || [];
    const row: Record<string, string> = {};

    headers.forEach((header, index) => {
      let value = values[index] || "";
      value = value.trim().replace(/^"|"$/g, "");
      row[header] = value;
    });

    rows.push(row);
  }

  return rows;
}

// Parse LinkedIn date format
function parseLinkedInDate(dateStr: string): Date | null {
  if (!dateStr || dateStr === "") return null;
  
  // Format: "Jan 2020" or "2020"
  const parts = dateStr.split(" ");
  if (parts.length === 2) {
    const months: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    const month = months[parts[0]] || 0;
    const year = parseInt(parts[1]);
    return new Date(year, month, 1);
  } else if (parts.length === 1) {
    return new Date(parseInt(parts[0]), 0, 1);
  }
  
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const results = {
      profile: 0,
      experience: 0,
      education: 0,
      skills: 0,
    };

    // Process Profile.csv
    const profileFile = formData.get("profile") as File | null;
    if (profileFile) {
      const content = await profileFile.text();
      const rows = parseCSV(content) as unknown as LinkedInProfile[];
      
      if (rows.length > 0) {
        const row = rows[0];
        await prisma.profile.upsert({
          where: { id: "default" },
          create: {
            id: "default",
            name: `${row["First Name"]} ${row["Last Name"]}`.trim(),
            headline: row.Headline || null,
            summary: row.Summary || null,
            email: row["Email Address"] || null,
          },
          update: {
            name: `${row["First Name"]} ${row["Last Name"]}`.trim(),
            headline: row.Headline || null,
            summary: row.Summary || null,
            email: row["Email Address"] || null,
          },
        });
        results.profile = 1;
      }
    }

    // Process Positions.csv
    const positionsFile = formData.get("positions") as File | null;
    if (positionsFile) {
      const content = await positionsFile.text();
      const rows = parseCSV(content) as unknown as LinkedInPosition[];

      // Delete existing and insert new
      await prisma.experience.deleteMany({});

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const startDate = parseLinkedInDate(row["Started On"]);
        const endDate = parseLinkedInDate(row["Finished On"] || "");

        if (startDate) {
          await prisma.experience.create({
            data: {
              company: row["Company Name"],
              title: row.Title,
              description: row.Description || null,
              location: row.Location || null,
              startDate,
              endDate,
              current: !endDate,
              order: i,
            },
          });
          results.experience++;
        }
      }
    }

    // Process Education.csv
    const educationFile = formData.get("education") as File | null;
    if (educationFile) {
      const content = await educationFile.text();
      const rows = parseCSV(content) as unknown as LinkedInEducation[];

      await prisma.education.deleteMany({});

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const startDate = parseLinkedInDate(row["Start Date"]);
        const endDate = parseLinkedInDate(row["End Date"] || "");

        if (startDate) {
          await prisma.education.create({
            data: {
              school: row["School Name"],
              degree: row["Degree Name"] || "Degree",
              description: row.Notes || null,
              startDate,
              endDate,
              order: i,
            },
          });
          results.education++;
        }
      }
    }

    // Process Skills.csv
    const skillsFile = formData.get("skills") as File | null;
    if (skillsFile) {
      const content = await skillsFile.text();
      const rows = parseCSV(content) as unknown as LinkedInSkill[];

      await prisma.skill.deleteMany({});

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row.Name) {
          await prisma.skill.create({
            data: {
              name: row.Name,
              category: "General",
              level: 80,
              order: i,
            },
          });
          results.skills++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      imported: results,
    });
  } catch (error) {
    console.error("Error importing LinkedIn data:", error);
    return NextResponse.json({ error: "Failed to import data" }, { status: 500 });
  }
}
