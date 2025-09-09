from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:3000/login")

    page.get_by_label("Email").fill("admin@example.com")
    page.get_by_label("Password").fill("password")
    page.get_by_role("button", name="Sign in").click()

    page.wait_for_url("http://localhost:3000/admin")

    page.goto("http://localhost:3000/admin/venues")

    # Wait for the page to load, the heading should be visible now
    expect(page.get_by_role("heading", name="Manage Venues")).to_be_visible(timeout=15000)

    page.screenshot(path="jules-scratch/verification/admin_venues_debug.png")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
