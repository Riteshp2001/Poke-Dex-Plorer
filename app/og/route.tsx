import { BASE_URL } from "@/lib/pokemon";
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") || "Pokémon";
  const id = searchParams.get("id") || "";
  const imageUrl = searchParams.get("image") || "/all-pokemon.svg";
  const type = searchParams.get("type") || "";
  // Define a default image if the provided one is a relative path
  // Fix possible double http:// issue by properly parsing the URL
  const imageUrlFixed = imageUrl
    .replace("https://http://", "http://")
    .replace("http://http://", "http://");
  const image = imageUrlFixed.startsWith("/")
    ? `${BASE_URL}${imageUrlFixed}`
    : imageUrlFixed;
  try {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background: "linear-gradient(to bottom right, #f3f4f6, #d1d5db)",
            fontFamily: "sans-serif",
          }}
        >
          {" "}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "60px",
              fontWeight: 800,
              color: "#111827",
              marginBottom: "24px",
              letterSpacing: "-0.025em",
            }}
          >
            {name}
            {id && (
              <span
                style={{
                  fontSize: "30px",
                  color: "#6b7280",
                  marginLeft: "16px",
                }}
              >
                #{id}
              </span>
            )}
          </div>
          <img
            src={image}
            width={320}
            height={320}
            alt={name}
            style={{
              borderRadius: "24px",
              boxShadow:
                "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
              background: "white",
              objectFit: "contain",
            }}
          />{" "}
          <div
            style={{
              display: "flex",
              fontSize: "24px",
              color: "#374151",
              marginTop: "32px",
              fontWeight: 600,
              textTransform: "capitalize",
            }}
          >
            {type}
          </div>{" "}
          <div
            style={{
              display: "flex",
              fontSize: "20px",
              color: "#2563eb",
              marginTop: "40px",
              fontWeight: 700,
            }}
          >
            PokeDex Explorer
          </div>{" "}
          <div
            style={{
              display: "flex",
              fontSize: "16px",
              color: "#1f2937",
              marginTop: "8px",
              fontWeight: 400,
            }}
          >
            by Ritesh Pandit · riteshdpandit.vercel.app
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("Error generating OG image:", error); // Fallback image if there's an error
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background: "linear-gradient(to bottom right, #2563eb, #7e22ce)",
            color: "white",
            fontFamily: "sans-serif",
          }}
        >
          {" "}
          <div
            style={{
              display: "flex",
              fontSize: "60px",
              fontWeight: 800,
              marginBottom: "24px",
              letterSpacing: "-0.025em",
            }}
          >
            {name}
            {id && (
              <span style={{ fontSize: "30px", marginLeft: "16px" }}>
                #{id}
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: "24px",
              marginTop: "32px",
              fontWeight: 600,
              textTransform: "capitalize",
            }}
          >
            {type || "Pokémon"}
          </div>
          <div
            style={{
              fontSize: "20px",
              marginTop: "40px",
              fontWeight: 700,
            }}
          >
            PokeDex Explorer
          </div>
          <div
            style={{
              fontSize: "16px",
              marginTop: "8px",
              fontWeight: 400,
            }}
          >
            by Ritesh Pandit · riteshdpandit.vercel.app
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
