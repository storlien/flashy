<template>
    <Dialog>
        <DialogTrigger as-child>
            <Button id="test" variant="outline">Rediger profil</Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Rediger profil</DialogTitle>
                <DialogDescription>Gjør endringer til profilen din her. Klikk 'Lagre' når du er ferdig</DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
                <!-- <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="username" class="text-right">Brukernavn</Label>
                    <Input id="username" class="col-span-3" />
                </div> -->
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="email" class="text-right">E-post</Label>
                    <Input id="email" class="col-span-3" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="password" class="text-right">Passord</Label>
                    <Input id="password" class="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <Button type="submit">Lagre</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<style lang="ts">
</style>
