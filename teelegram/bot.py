import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from bs4 import BeautifulSoup

# Set up logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

# Dictionary to store extracted name-link mappings
name_link_mapping = {}

# Function to parse uploaded HTML or text message and extract hyperlinks with "CLICK HERE"
def extract_links_from_html(file_content):
    soup = BeautifulSoup(file_content, 'html.parser')

    # Loop through all hyperlinks
    for a in soup.find_all('a'):
        link_text = a.get_text(strip=True)  # Get text of the hyperlink
        url = a.get('href')  # Get the URL from the hyperlink
        
        # Check if the hyperlink text is "CLICK HERE" and the URL is valid
        if link_text == "CLICK HERE" and url:
            # Find the text that comes before this hyperlink
            previous_text = a.find_previous(string=True)
            if previous_text:
                name = previous_text.strip()  # Get the name preceding the link
                name_link_mapping[name.upper()] = url  # Store the mapping in uppercase

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text("Welcome! Please upload a file with hyperlinks or send the HTML content directly.")

async def handle_document(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    file = update.message.document
    file_content = await file.download_as_bytearray()  # Download the file content

    # Extract links from the file
    extract_links_from_html(file_content)

    await update.message.reply_text("Links extracted successfully! You can now request links by name or use /show_links to see all links.")

async def handle_text(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    text = update.message.text
    extract_links_from_html(text.encode())  # Pass the text content as bytes for parsing
    await update.message.reply_text("Links extracted from text successfully! You can now request links by name or use /show_links to see all links.")

async def open_link(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    name = update.message.text.strip().upper()  # Get the name and convert to uppercase
    if name in name_link_mapping:
        link = name_link_mapping[name]
        await update.message.reply_text(f"Here is the link for {name}: {link}")
    else:
        await update.message.reply_text("No valid link found for this name. Please try again.")

async def show_all_links(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if name_link_mapping:
        links = '\n'.join(f"{name}: {link}" for name, link in name_link_mapping.items())
        await update.message.reply_text(f"Here are all the extracted links:\n{links}")
    else:
        await update.message.reply_text("No links have been extracted yet.")

async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    logger.error(f"Update {update} caused error {context.error}")

def main():
    bot_token = '7811619374:AAGVEsLOm5w5nBFKshQngUOyvgzIBWSpm3c'
    application = Application.builder().token(bot_token).build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.Document.ALL, handle_document))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))
    application.add_handler(CommandHandler("show_links", show_all_links))  # Command to show all links
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, open_link))
    application.add_error_handler(error_handler)

    application.run_polling()
    print("Bot is running... Press Ctrl+C to stop.")

if __name__ == "__main__":
    main()
