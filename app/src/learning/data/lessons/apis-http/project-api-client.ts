import type { LessonContent } from '../types';

export const projectApiClient: LessonContent = {
  slug: "project-api-client",
  problemContent: `# Project: Build a Weather App

Put it all together! Build a tool that gets weather data.

## What You'll Build

A class that:
1. Looks up a city's coordinates
2. Gets the current weather
3. Displays it nicely

## Free API (No Key Needed!)

**Geocoding (city → coordinates):**
\`\`\`
https://geocoding-api.open-meteo.com/v1/search?name=London
\`\`\`

**Weather (coordinates → forecast):**
\`\`\`
https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.1&current_weather=true
\`\`\`

## Your Task

1. Complete \`get_coordinates()\` - look up city location
2. Complete \`get_weather()\` - fetch weather data
3. Complete \`display()\` - print nicely formatted`,

  solutionContent: `# Solution: Weather App

\`\`\`python
import requests

class WeatherApp:
    def __init__(self):
        self.geo_url = "https://geocoding-api.open-meteo.com/v1/search"
        self.weather_url = "https://api.open-meteo.com/v1/forecast"

    def get_coordinates(self, city):
        response = requests.get(self.geo_url, params={'name': city})
        data = response.json()

        if 'results' not in data:
            return None

        result = data['results'][0]
        return {
            'lat': result['latitude'],
            'lon': result['longitude'],
            'name': result['name']
        }

    def get_weather(self, city):
        coords = self.get_coordinates(city)
        if not coords:
            return None

        response = requests.get(self.weather_url, params={
            'latitude': coords['lat'],
            'longitude': coords['lon'],
            'current_weather': True
        })

        weather = response.json()['current_weather']
        return {
            'city': coords['name'],
            'temp': weather['temperature'],
            'wind': weather['windspeed']
        }

    def display(self, city):
        weather = self.get_weather(city)
        if weather:
            print(f"Weather in {weather['city']}:")
            print(f"  Temperature: {weather['temp']}°C")
            print(f"  Wind: {weather['wind']} km/h")
        else:
            print(f"City not found: {city}")

# Test it!
app = WeatherApp()
app.display("London")
app.display("Tokyo")
\`\`\``,

  explanationContent: `# How It Works

## Step 1: Get Coordinates
\`\`\`python
# Search for "London"
response = requests.get(url, params={'name': 'London'})
# Returns: latitude=51.5, longitude=-0.1
\`\`\`

## Step 2: Get Weather
\`\`\`python
# Use coordinates to get weather
response = requests.get(url, params={
    'latitude': 51.5,
    'longitude': -0.1,
    'current_weather': True
})
\`\`\`

## Step 3: Display
Format the data nicely for the user!`,

  realworldContent: `# Real-World Extensions

## Add Error Handling
\`\`\`python
try:
    weather = self.get_weather(city)
except requests.RequestException:
    print("Network error!")
\`\`\`

## Add Caching
\`\`\`python
def __init__(self):
    self.cache = {}

def get_weather(self, city):
    if city in self.cache:
        return self.cache[city]
    # ... fetch and cache
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Not Checking if City Exists
\`\`\`python
# Bad - crashes if no results
result = data['results'][0]

# Good - check first
if 'results' not in data:
    return None
\`\`\`

## 2. Not Using params=
\`\`\`python
# Bad - building URL manually
url = f"{base}?name={city}"

# Good - let requests handle it
requests.get(base, params={'name': city})
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: Why use a class?
**Answer:** Groups related functions, stores config (URLs), can add features like caching.

## Q2: How to handle API errors?
**Answer:** Check status_code, use try/except for network errors, validate response data.`,

  starterCode: `import requests

class WeatherApp:
    def __init__(self):
        self.geo_url = "https://geocoding-api.open-meteo.com/v1/search"
        self.weather_url = "https://api.open-meteo.com/v1/forecast"

    def get_coordinates(self, city):
        # TODO: Get lat/lon for city
        # 1. Make request with params={'name': city}
        # 2. Return {'lat': ..., 'lon': ..., 'name': ...}
        pass

    def get_weather(self, city):
        # TODO: Get weather for city
        # 1. Get coordinates
        # 2. Make request with latitude, longitude, current_weather=True
        # 3. Return {'city': ..., 'temp': ..., 'wind': ...}
        pass

    def display(self, city):
        weather = self.get_weather(city)
        if weather:
            print(f"Weather in {weather['city']}:")
            print(f"  Temperature: {weather['temp']}°C")
        else:
            print(f"City not found: {city}")

# Test
app = WeatherApp()
app.display("London")`,

  solutionCode: `import requests

class WeatherApp:
    def __init__(self):
        self.geo_url = "https://geocoding-api.open-meteo.com/v1/search"
        self.weather_url = "https://api.open-meteo.com/v1/forecast"

    def get_coordinates(self, city):
        response = requests.get(self.geo_url, params={'name': city})
        data = response.json()

        if 'results' not in data:
            return None

        result = data['results'][0]
        return {
            'lat': result['latitude'],
            'lon': result['longitude'],
            'name': result['name']
        }

    def get_weather(self, city):
        coords = self.get_coordinates(city)
        if not coords:
            return None

        response = requests.get(self.weather_url, params={
            'latitude': coords['lat'],
            'longitude': coords['lon'],
            'current_weather': True
        })

        weather = response.json()['current_weather']
        return {
            'city': coords['name'],
            'temp': weather['temperature'],
            'wind': weather['windspeed']
        }

    def display(self, city):
        weather = self.get_weather(city)
        if weather:
            print(f"Weather in {weather['city']}:")
            print(f"  Temperature: {weather['temp']}°C")
        else:
            print(f"City not found: {city}")

# Test
app = WeatherApp()
app.display("London")`,

  hints: [
    "Use requests.get(url, params={...})",
    "Check if 'results' exists before accessing",
    "Access nested data: data['results'][0]['latitude']",
    "Return None if city not found"
  ]
};
