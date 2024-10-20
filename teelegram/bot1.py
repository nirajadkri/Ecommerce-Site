import time
import asyncio
import os
from telegram import Update, MessageEntity
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

# Dictionary to store URLs for each user
user_sessions = {}

# Replace with your bot token
TOKEN = "7675391297:AAFF-aCSC4iEVd4LGvDwmPZmaRAFwF5UgQE"

# Initialize Selenium WebDriver
def setup_browser():
    options = Options()
    options.add_argument("--disable-infobars")
    options.add_argument("--start-maximized")
    options.add_experimental_option("detach", True)  # Keeps the browser open
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)
    return driver

# HTML template for the "Next" button interface
HTML_TEMPLATE = """
<html>
<head>
    <title>Next Button Interface</title>
</head>
<body>
    <div style="position: absolute; top: 10px; right: 10px;">
        <button onclick="window.open('', '_self').close();">Next</button>
    </div>
</body>
</html>
"""

# Save the HTML template locally as a file
def create_html_interface():
    with open("next_button.html", "w") as file:
        file.write(HTML_TEMPLATE)

# Open a link with the "Next" button interface
def open_link_with_next_button(driver, url):
    # Open the link in the browser
    driver.get(url)

    # Open the HTML "Next button" in a new tab
    driver.execute_script("window.open('next_button.html', '_blank');")

# /start command handler
async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "Send me a message with 'CLICK HERE' links, and I'll open them one-by-one using a 'Next' button."
    )

# Message handler to extract URLs and manage user sessions
async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    message = update.message
    user_id = update.effective_user.id

    # Extract URLs from message entities
    urls = []
    if message.entities:
        for entity in message.entities:
            if entity.type == MessageEntity.TEXT_LINK:
                urls.append(entity.url)

    if urls:
        user_sessions[user_id] = {
            "urls": urls,  # Store user's URLs
            "driver": setup_browser()  # Create a new browser for the user
        }
        await update.message.reply_text(
            f"Found {len(urls)} links. Use the 'Next' button to navigate through them."
        )
        open_next_link(user_id)  # Start opening links for the user
    else:
        await update.message.reply_text("No valid URLs found. Please try again.")

# Open the next link in sequence for a specific user
def open_next_link(user_id):
    session = user_sessions.get(user_id)

    if session and session["urls"]:
        next_url = session["urls"].pop(0)  # Get the next URL
        print(f"Opening for user {user_id}: {next_url}")
        open_link_with_next_button(session["driver"], next_url)  # Open the link with "Next" button
    else:
        print(f"All links opened for user {user_id}.")
        # Close the browser when all links are done
        if session and session["driver"]:
            session["driver"].quit()
            del user_sessions[user_id]

# Main function to start the bot
if __name__ == '__main__':
    # Create the "Next" button HTML interface
    create_html_interface()

    print("Starting bot...")
    app = Application.builder().token(TOKEN).build()

    # Add handlers for /start and messages
    app.add_handler(CommandHandler('start', start_command))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    print("Polling...")
    app.run_polling(poll_interval=3)
