import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page, request }) => {
    const resposta = await request.post("http://localhost:3000/__reset");
    expect(resposta.status()).toBe(204);
    await page.goto("/");
    await page.getByRole('button', { name: 'Clientes' }).click()
});

//C1 - Listar os clientes iniciais
test('lista clientes inicias', async ({ page }) => {
    await expect(page.getByRole('heading', {  name: 'Clientes'  })).toBeVisible()
    await expect(page.getByRole('row')).toHaveCount(3)
    await expect(page.getByRole('cell', { name: 'Ana Souza' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Bruno Lima' })).toBeVisible()
})

//C2 - Cadastrar um cliente novo
test('cadastra um cliente novo', async ({page}) => {
    await page.getByLabel('Nome').fill('Carla Dias')
    await page.getByLabel('Email').fill('carla@email.com')
    await page.getByRole('button', {name: 'Cadastrar'}).click()

    const linha = page.getByRole('row', { name: /Carla Dias carla@email\.com/ })
    await expect(linha).toBeVisible()
    await expect(linha).toContainText('Carla Dias')
    await expect(linha).toContainText('carla@email.com')
})