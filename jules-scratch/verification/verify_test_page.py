from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:3000/login")

    page.get_by_label("Email").fill("admin@example.com")
    page.get_by_label("Password").fill("password123")
    page.get_by_role("button", name="Sign in").click()

    page.screenshot(path="jules-scratch/verification/debug_after_login_click.png")

    page.wait_for_url("http://localhost:3000/admin")

    expect(page.get_by_text("API Response: Test route works!")).to_be_visible(timeout=15000)

    page.screenshot(path="jules-scratch/verification/admin_test_page.png")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
