const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

type SpotifyImage = { url: string };
type SpotifyArtist = { name: string };
type SpotifyTrack = {
  name: string;
  artists: SpotifyArtist[];
  album: { images: SpotifyImage[] };
  duration_ms: number;
  external_urls: { spotify: string };
};

type DisplayTrack = {
  title: string;
  artist: string;
  albumArtUrl: string;
  spotifyUrl: string;
};

export type EarlierTodayTrack = DisplayTrack & { playedAgo: string };

export type ListeningLead =
  | (DisplayTrack & {
      status: "now-playing";
      elapsed: string;
      duration: string;
      progressPercent: number;
    })
  | (DisplayTrack & {
      status: "last-played";
      playedAgo: string;
    });

export type ListeningWidgetData = {
  lead: ListeningLead;
  earlierToday: EarlierTodayTrack[];
};

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing Spotify credentials in environment variables");
  }

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Spotify token refresh failed (${response.status})`);
  }

  const json = (await response.json()) as { access_token: string };
  return json.access_token;
}

async function fetchSpotify<T>(accessToken: string, path: string): Promise<T | null> {
  const response = await fetch(`${SPOTIFY_API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  // 204 = no content, e.g. nothing is currently playing
  if (response.status === 204) return null;
  if (!response.ok) {
    throw new Error(`Spotify request to ${path} failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

function toDisplayTrack(track: SpotifyTrack): DisplayTrack {
  return {
    title: track.name,
    artist: track.artists.map((artist) => artist.name).join(", "),
    albumArtUrl: track.album.images[0]?.url ?? "",
    spotifyUrl: track.external_urls.spotify,
  };
}

function formatClock(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatPlayedAgo(isoTimestamp: string): string {
  const minutes = Math.floor((Date.now() - new Date(isoTimestamp).getTime()) / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

type CurrentlyPlayingResponse = {
  is_playing: boolean;
  progress_ms: number | null;
  item: SpotifyTrack | null;
};

type RecentlyPlayedResponse = {
  items: { track: SpotifyTrack; played_at: string }[];
};

export async function getListeningWidgetData(): Promise<ListeningWidgetData | null> {
  const accessToken = await getAccessToken();

  const [nowPlaying, recentlyPlayed] = await Promise.all([
    fetchSpotify<CurrentlyPlayingResponse>(accessToken, "/me/player/currently-playing"),
    fetchSpotify<RecentlyPlayedResponse>(accessToken, "/me/player/recently-played?limit=5"),
  ]);

  const recentTracks: EarlierTodayTrack[] =
    recentlyPlayed?.items.map((item) => ({
      ...toDisplayTrack(item.track),
      playedAgo: formatPlayedAgo(item.played_at),
    })) ?? [];

  if (nowPlaying?.is_playing && nowPlaying.item) {
    return {
      lead: {
        status: "now-playing",
        ...toDisplayTrack(nowPlaying.item),
        elapsed: formatClock(nowPlaying.progress_ms ?? 0),
        duration: formatClock(nowPlaying.item.duration_ms),
        progressPercent: Math.round(
          ((nowPlaying.progress_ms ?? 0) / nowPlaying.item.duration_ms) * 100
        ),
      },
      earlierToday: recentTracks.slice(0, 4),
    };
  }

  const [lastPlayed, ...rest] = recentTracks;
  if (!lastPlayed) return null;

  return {
    lead: { status: "last-played", ...lastPlayed },
    earlierToday: rest.slice(0, 4),
  };
}
